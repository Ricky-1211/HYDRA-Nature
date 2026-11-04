import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { connectDB } from '../config/db';

export const sampleProducts = [
  {
    name: 'Hydra Celestial Barrier Glaze',
    slug: 'hydra-celestial-barrier-glaze',
    subtitle: 'Micro-Algae • Botanical Ceramides • Niacinamide',
    description: 'An ultra-refined lipid replenishment glaze that fortifies the cellular skin mantle, restores depleted moisture reservoirs, and yields a luminous glass-skin finish with zero tackiness.',
    price: 1850,
    originalPrice: 2400,
    category: 'Face Care',
    subcategory: 'Moisturizers',
    tag: 'Best Seller',
    images: [
      'https://images.unsplash.com/photo-1608248597359-5484803716a4?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80',
    ],
    stock: 65,
    rating: 4.9,
    reviewCount: 42,
    ingredients: [
      'Micro-Algae Phyto-Lipids',
      'Ceramide NP & AP Complex',
      'Pure Niacinamide (5%)',
      'Cold-Pressed Jojoba Esters',
      'Alpine Edelweiss Extract',
    ],
    keyBenefits: [
      '72-Hour Continuous Hydro-Lock',
      'Rapidly repairs impaired acid mantle & barrier permeability',
      'Soothes micro-inflammation and redness within 15 minutes',
      'Imparts a non-greasy, glass-like dewy veil',
    ],
    howToUse: [
      'Cleanse thoroughly and tone face with lukewarm mist.',
      'Dispense a pea-sized amount onto fingertips.',
      'Gently press into face, neck, and décolletage using upward strokes.',
    ],
    size: '50ml',
    skinType: ['All Skin Types', 'Dry', 'Sensitive', 'Normal'],
    isBestSeller: true,
    isFeatured: true,
    isActive: true,
  },
  {
    name: 'Luminescent Youth Elixir Serum',
    slug: 'luminescent-youth-elixir-serum',
    subtitle: 'Triple Hyaluronic Acid • Bio-Retinol • Marine Collagen',
    description: 'A transformative bioactive cellular nectar engineered with botanical bakuchiol and multi-molecular weight hyaluronic acid to visibly re-densify contours and accelerate cellular regeneration.',
    price: 2250,
    originalPrice: 2950,
    category: 'Face Care',
    subcategory: 'Serums',
    tag: 'Trending',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=80',
    ],
    stock: 48,
    rating: 5.0,
    reviewCount: 38,
    ingredients: [
      'Multi-Molecular Hyaluronic Acid (2%)',
      'Botanical Bakuchiol (1.5%)',
      'Marine Bio-Collagen Peptide Matrix',
      'Organic Rose Otto Hydrosol',
      'Coenzyme Q10',
    ],
    keyBenefits: [
      'Clinically softens expression lines in 14 days',
      'Visibly plumps epidermis across multi-depth dermal strata',
      'Delivers non-irritating retinol alternatives safe for daily daylight use',
      'Refines micro-texture and enhances skin elasticity',
    ],
    howToUse: [
      'Apply 3-4 drops directly onto freshly cleansed, damp skin.',
      'Tap rhythmically with ring fingers until completely absorbed.',
      'Seal with Hydra Celestial Barrier Glaze.',
    ],
    size: '30ml',
    skinType: ['All Skin Types', 'Mature', 'Dull', 'Combination'],
    isBestSeller: true,
    isFeatured: true,
    isActive: true,
  },
  {
    name: 'Botanical Clarifying Nectar Cleanser',
    slug: 'botanical-clarifying-nectar-cleanser',
    subtitle: 'Green Tea Matcha • Salicylic Willow Bark • Centella Asiatica',
    description: 'A sulfate-free, low-pH gel-to-milk cleanser that lifts impurities, unclogs deep pores, and preserves the vital moisture mantle without leaving skin stripped or tight.',
    price: 1150,
    originalPrice: 1450,
    category: 'Face Care',
    subcategory: 'Cleansers',
    tag: 'Organic',
    images: [
      'https://images.unsplash.com/photo-1556228722-d0b9771b272f?auto=format&fit=crop&w=900&q=80',
    ],
    stock: 80,
    rating: 4.8,
    reviewCount: 29,
    ingredients: [
      'Organic Ceremonial Matcha Camellia',
      'Natural Willow Bark BHA (1%)',
      'Centella Asiatica (Cica) Leaf Juice',
      'Decyl Glucoside Sugar Cleanser',
      'Plant Squalane',
    ],
    keyBenefits: [
      'Clears congestive sebum without stripping barrier hydration',
      'Balances optimal surface pH at 5.5',
      'Calms active breakouts and thermal irritation',
      'Rinses completely clean with zero residue',
    ],
    howToUse: [
      'Dispense two pumps into damp palms and lather into soft foam.',
      'Massage in circular motions over face for 60 seconds.',
      'Rinse thoroughly with lukewarm water.',
    ],
    size: '150ml',
    skinType: ['Oily', 'Combination', 'Acne-Prone', 'Sensitive'],
    isBestSeller: false,
    isFeatured: true,
    isActive: true,
  },
  {
    name: 'Silk Velvet Body Souffle',
    slug: 'silk-velvet-body-souffle',
    subtitle: 'Raw Shea Butter • Sweet Almond Oil • Golden Jojoba',
    description: 'An airy, whipped dermal cream crafted for immediate full-body hydration. Absorbs instantaneously to leave skin satiny soft with an understated aroma of sandalwood and wild vanilla.',
    price: 1650,
    originalPrice: 2100,
    category: 'Body Care',
    subcategory: 'Moisturizers',
    tag: 'New',
    images: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80',
    ],
    stock: 35,
    rating: 4.9,
    reviewCount: 19,
    ingredients: [
      'Unrefined Ghanaian Shea Butter',
      'Cold-Pressed Sweet Almond Oil',
      'Virgin Moroccan Argan Oil',
      'Vitamin E (Tocopherol)',
      'Natural Vanilla Oleoresin',
    ],
    keyBenefits: [
      'Immediate 48-hour hydration for dry, crepey body skin',
      'Absorbs in seconds without leaving oily film on clothing',
      'Softens elbows, knees, and rough patches',
      'Restores silky suppleness and natural gleam',
    ],
    howToUse: [
      'Smooth lavishly over towel-dried skin after bathing.',
      'Concentrate on drier areas such as elbows, knees, and heels.',
    ],
    size: '200ml',
    skinType: ['All Skin Types', 'Dry', 'Very Dry'],
    isBestSeller: false,
    isFeatured: true,
    isActive: true,
  },
  {
    name: 'Phyto-Keratin Hair Repair Serum',
    slug: 'phyto-keratin-hair-repair-serum',
    subtitle: 'Argan Kernel • Biomimetic Keratin • Rosemary Leaf',
    description: 'A weightless botanical hair elixir that seals split ends, protects against thermal styling up to 230°C, and revives salon-grade glass shine without greasiness.',
    price: 1450,
    originalPrice: 1850,
    category: 'Hair Care',
    subcategory: 'Essentials',
    tag: 'Trending',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
    ],
    stock: 55,
    rating: 4.7,
    reviewCount: 24,
    ingredients: [
      'Pure Cold-Pressed Moroccan Argan Oil',
      'Hydrolyzed Botanical Pea Keratin',
      'Rosemary Leaf CO2 Extract',
      'Golden Meadowfoam Seed Oil',
    ],
    keyBenefits: [
      'Reduces breakage by 89% upon first application',
      'Thermal defense up to 230°C / 450°F',
      'Tames humidity-induced frizz and flyaways',
      'Promotes healthy scalp microcirculation',
    ],
    howToUse: [
      'Warm 1-2 pumps between hands.',
      'Work through damp hair lengths before blow-drying, or smooth onto dry ends for mirror shine.',
    ],
    size: '100ml',
    skinType: ['All Hair Types', 'Dry', 'Color-Treated', 'Damaged'],
    isBestSeller: false,
    isFeatured: true,
    isActive: true,
  },
  {
    name: 'Hydra Imperial Ritual Discovery Set',
    slug: 'hydra-imperial-ritual-discovery-set',
    subtitle: 'Cleanser • Serum • Glaze • Silk Sleep Mask',
    description: 'The definitive 4-piece luxury ritual curated in a collector bespoke keepsake box. Designed to deliver cellular transformation and deeply radiant skin within 7 days.',
    price: 3899,
    originalPrice: 5200,
    category: 'Skincare Sets',
    subcategory: 'Essentials',
    tag: 'Limited',
    images: [
      'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=900&q=80',
    ],
    stock: 25,
    rating: 5.0,
    reviewCount: 31,
    ingredients: [
      'Contains deluxe sizes of Nectar Cleanser (50ml)',
      'Youth Elixir Serum (15ml)',
      'Celestial Barrier Glaze (25ml)',
      'Pure Mulberry Silk Sleeping Mask',
    ],
    keyBenefits: [
      'Complete 4-step morning & evening clinical regime',
      'Saves 35% compared to purchasing formulations individually',
      'Presented in sustainable foil-embossed packaging',
      'Perfect luxury gifting piece',
    ],
    howToUse: [
      'Step 1: Cleanse with Clarifying Nectar Cleanser.',
      'Step 2: Replenish with Youth Elixir Serum.',
      'Step 3: Seal with Barrier Glaze.',
      'Step 4: Wear Mulberry Silk Mask for uninterrupted cellular restorative sleep.',
    ],
    size: 'Complete Ritual Set',
    skinType: ['All Skin Types'],
    isBestSeller: true,
    isFeatured: true,
    isActive: true,
  },
];

export const seedDatabase = async (force: boolean = false): Promise<void> => {
  try {
    // 1. Ensure Default Admin Account Exists
    const adminEmail = 'admin@hydraskincare.com';
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      console.log('🌿 Creating default administrative user...');
      admin = await User.create({
        name: 'Hydra Admin',
        email: adminEmail,
        password: 'Admin@123',
        role: 'admin',
        phone: '+91 98765 43210',
      });
      console.log(`✅ Default admin created successfully: ${adminEmail} (password: Admin@123)`);
    }

    // 2. Dynamic Product Catalog Seeding (Only if empty or forced)
    const productCount = await Product.countDocuments();
    if (productCount === 0 || force) {
      if (force && productCount > 0) {
        console.log('🌿 Force flag enabled: resetting sample products catalog...');
        await Product.deleteMany({});
      }

      console.log('🌿 Seeding initial Hydra luxury skincare formulations...');
      for (const prodData of sampleProducts) {
        await Product.create(prodData);
      }
      console.log(`✅ Seeded ${sampleProducts.length} dynamic products successfully!`);
    } else {
      console.log(`🌿 Dynamic catalog already holds ${productCount} products. Skipping duplicate seed.`);
    }
  } catch (error) {
    console.error('❌ Error executing database seed:', error);
  }
};

// Direct script execution support
if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      const isForce = process.argv.includes('--force');
      await seedDatabase(isForce);
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}
