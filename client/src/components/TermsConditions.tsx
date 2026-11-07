import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Info, BookOpen, UserCheck, AlertCircle, CreditCard, ShoppingBag, Truck, RotateCcw,
  Store, ShieldCheck, MessageSquare, Scale, Lock, Headphones, Mail, Gavel, FlaskConical,
} from 'lucide-react';
import {
  LegalLayout, LegalSection, Clause, Callout, BulletList, InfoTable, EmailLink, PhoneLink, ContactCard, ADDRESS,
} from './legal/LegalLayout';

const privacyLink = (
  <Link to="/privacy" className="text-[#13382B] font-medium underline decoration-[#C5A880] underline-offset-2">
    Privacy Policy
  </Link>
);

const sections: LegalSection[] = [
  {
    id: 'introduction',
    title: 'Introduction and Acceptance',
    icon: <Info />,
    content: (
      <>
        <Clause n="1.1">
          These Terms and Conditions ("Terms") govern your use of the website www.hydra24n.com (the "Website") and
          your purchase of Hydra 24n Professional Beauty products, whether online or through an authorised salon or
          distributor.
        </Clause>
        <Clause n="1.2">
          The Website and the Hydra 24n brand are owned and operated by Zulynz Beauty Global Private Limited, a company
          registered in India with its registered office at {ADDRESS} (CIN: U96020OD2024PTC045226, GSTIN:
          21AACCZ3623K1ZF) ("Hydra 24n", "we", "us" or "our").
        </Clause>
        <Clause n="1.3">
          By accessing the Website, creating an account or placing an order, you confirm that you have read,
          understood and agree to be bound by these Terms, our {privacyLink} and any other policy referred to in these
          Terms. If you do not agree, please do not use the Website or purchase our products.
        </Clause>
        <Clause n="1.4">
          These Terms are an electronic record under the Information Technology Act, 2000 and the rules made under it,
          and do not require a physical or digital signature.
        </Clause>
      </>
    ),
  },
  {
    id: 'definitions',
    title: 'Definitions',
    icon: <BookOpen />,
    content: (
      <InfoTable
        rows={[
          ['"Customer" or "you"', 'Any person who visits the Website or purchases Products.'],
          ['"Products"', 'The Hydra 24n skincare range, facial kits and any other items offered for sale by us.'],
          ['"Order"', 'A request to purchase Products placed through the Website.'],
          ['"Professional Partner"', 'A salon, spa, beauty professional or distributor authorised by us in writing to buy, use or resell Products.'],
          ['"Delivery Date"', 'The date on which a Product is delivered to the address given in your Order, as recorded by our courier partner.'],
        ]}
      />
    ),
  },
  {
    id: 'eligibility',
    title: 'Eligibility and User Accounts',
    icon: <UserCheck />,
    content: (
      <>
        <Clause n="3.1">
          You must be at least 18 years old and legally able to enter into a binding contract under the Indian
          Contract Act, 1872 to place an Order. A minor may use the Website only under the supervision of a parent or
          legal guardian.
        </Clause>
        <Clause n="3.2">
          You agree to provide true, accurate and complete information when creating an account or placing an Order,
          and to keep it updated.
        </Clause>
        <Clause n="3.3">
          You are responsible for keeping your login details confidential and for all activity under your account.
          Inform us immediately at <EmailLink /> if you suspect any unauthorised use.
        </Clause>
        <Clause n="3.4">
          We may suspend or close any account that provides false information, breaches these Terms or is used for
          fraudulent or unlawful purposes.
        </Clause>
      </>
    ),
  },
  {
    id: 'products',
    title: 'Products, Cosmetic Use and Patch Test',
    icon: <FlaskConical />,
    content: (
      <>
        <Clause n="4.1">
          All Products are cosmetics manufactured under licence in accordance with the Drugs and Cosmetics Act, 1940
          and the Cosmetics Rules, 2020 (Manufacturing Licence No.: 265 COS (H)). They are not medicines and are not
          intended to diagnose, treat, cure or prevent any disease or skin condition.
        </Clause>
        <Clause n="4.2">
          Results vary from person to person depending on skin type, age, lifestyle, environment and correct use.
          Images, before-and-after visuals and descriptions on the Website and in our marketing are illustrative and
          do not guarantee any particular result.
        </Clause>
        <Callout tone="sage">
          <Clause n="4.3" title="Patch test">
            Before first use of any Product, apply a small amount behind the ear or on the inner forearm and wait 24
            hours. Do not use the Product if redness, itching, burning, swelling or any other irritation occurs.
          </Clause>
        </Callout>
        <Clause n="4.4">
          Read the full ingredient list on the pack before use. If you have known allergies, sensitive skin, a skin
          condition, or are pregnant or breastfeeding, consult a dermatologist or doctor before use. Products
          containing retinol should be used at night only, followed by sunscreen during the day.
        </Clause>
        <Clause n="4.5">
          For external use only. Avoid contact with eyes; if contact occurs, rinse thoroughly with clean water. Keep
          out of reach of children. Store in a cool, dry place away from direct sunlight. Do not use after the expiry
          date printed on the pack.
        </Clause>
        <Clause n="4.6">
          Stop use immediately and seek medical advice if any adverse reaction occurs, and inform us at <EmailLink />{' '}
          with your Order number and batch number.
        </Clause>
        <Clause n="4.7">
          We take care to display Product colours, packaging and details accurately, but actual packaging may differ
          slightly due to screen settings or packaging updates. The label on the Product you receive is the
          authoritative source of ingredient and usage information.
        </Clause>
      </>
    ),
  },
  {
    id: 'pricing',
    title: 'Pricing, Taxes and Payment',
    icon: <CreditCard />,
    content: (
      <>
        <Clause n="5.1">
          All prices are in Indian Rupees (INR) and are the Maximum Retail Price (MRP), inclusive of all applicable
          taxes including GST, unless stated otherwise. Shipping charges, if any, are shown separately at checkout
          before you pay.
        </Clause>
        <Clause n="5.2">
          Prices, offers and discounts may change without notice. The price that applies to your Order is the price
          shown at the time you place it. Promotional offers cannot be combined unless stated, and may be withdrawn at
          any time.
        </Clause>
        <Clause n="5.3">
          If a Product is listed at an incorrect price because of a technical or typographical error, we may cancel
          the Order and refund any amount paid in full, even after an order confirmation has been sent.
        </Clause>
        <Clause n="5.4">
          We accept payment through UPI, debit/credit cards, net banking, wallets and Cash on Delivery (COD). Online
          payments are processed by our payment partner Razorpay. We do not store your card details.
        </Clause>
        <Clause n="5.5">
          A GST invoice is issued for every Order. Professional Partners who need a business invoice must provide a
          valid GSTIN at the time of ordering.
        </Clause>
      </>
    ),
  },
  {
    id: 'orders',
    title: 'Orders and Cancellation',
    icon: <ShoppingBag />,
    content: (
      <>
        <Clause n="6.1">
          Placing an Order is an offer to buy. A contract is formed only when we dispatch the Product and send you a
          shipping confirmation.
        </Clause>
        <Clause n="6.2">
          We may refuse or cancel any Order, in whole or in part, if the Product is out of stock, the delivery address
          is not serviceable, payment fails, the Order appears fraudulent or in bulk for unauthorised resale, or the
          information provided is incorrect. Any amount already paid will be refunded in full.
        </Clause>
        <Clause n="6.3">
          You may cancel an Order free of charge before it is dispatched by writing to <EmailLink /> or using the
          cancel option in your account. Once an Order has been dispatched, it cannot be cancelled; section 8 applies
          instead.
        </Clause>
        <Clause n="6.4">
          Refunds for cancelled prepaid Orders are made to the original payment method within 5–7 working days of
          cancellation.
        </Clause>
      </>
    ),
  },
  {
    id: 'shipping',
    title: 'Shipping and Delivery',
    icon: <Truck />,
    content: (
      <>
        <Clause n="7.1">We currently deliver within India only, to pin codes serviced by our courier partners.</Clause>
        <Clause n="7.2">
          Orders are usually delivered within 5–7 working days of being placed, and in any case within 15 days. These
          timelines are estimates; delays caused by couriers, weather, public holidays or events outside our control
          do not entitle you to cancel a dispatched Order, though we will help you track it.
        </Clause>
        <Clause n="7.3">
          Risk in the Products passes to you on delivery. Ownership passes once full payment is received.
        </Clause>
        <Clause n="7.4">
          Check your parcel on delivery. Do not accept a parcel that is visibly torn, crushed, wet or tampered with. We
          strongly recommend recording a continuous, unedited unboxing video from the sealed parcel to the Products,
          as this will be needed for any claim under section 8.
        </Clause>
        <Clause n="7.5">
          If delivery fails because of an incorrect address or because you were unavailable or refused the parcel
          without valid reason, re-delivery charges may apply, or the Order may be cancelled with the shipping charge
          deducted from any refund.
        </Clause>
      </>
    ),
  },
  {
    id: 'returns',
    title: 'Return and Refund Policy',
    icon: <RotateCcw />,
    content: (
      <>
        <p>
          At Hydra 24n, we take pride in the quality and safety of our professional beauty and skincare formulations.
          Because our Products are applied to the skin, we maintain strict quality-control and hygiene standards. By
          placing an Order, you agree to this Return and Refund Policy.
        </p>
        <Clause n="8.1" title="Eligibility window (3 days)">
          You may raise a return or replacement request within 3 (three) days from the date and time of successful
          delivery, as recorded by our courier partner. Requests raised after this window will not be accepted.
        </Clause>
        <Clause n="8.2" title="Reasons for return">
          A return or replacement is accepted if you receive:
          <div className="mt-2">
            <BulletList
              items={[
                'A physically damaged, broken or leaking Product;',
                'An incorrect Product, different from what was ordered; or',
                'An expired Product.',
              ]}
            />
          </div>
          <p className="mt-3">
            <strong className="text-[#13382B]">Return without a reason.</strong> You may also return a Product without
            giving any reason within the same 3-day window, provided it is unopened, unused and in its original sealed
            packaging. In this case, the Product price will be refunded, but shipping charges will not.
          </p>
        </Clause>
        <Clause n="8.3" title="Proof required">
          For damaged, broken, leaking, incorrect or expired Products, clear photographs or video of the unboxing and
          of the defective Product must be shared at the time of raising the request.
        </Clause>
        <Clause n="8.4" title="How to raise a request">
          Email <EmailLink /> or call / WhatsApp <PhoneLink /> with your Order number and the proof described in 8.3.
        </Clause>
        <Clause n="8.5" title="Non-returnable and non-refundable">
          To protect health, safety and hygiene, Products cannot be returned or refunded if:
          <div className="mt-2">
            <BulletList
              items={[
                'The safety seal, outer plastic wrap or cap/lid has been opened, broken or tampered with after delivery. Once a seal is broken, the Product is strictly non-returnable, unless it arrived damaged and this is shown in the unboxing proof;',
                'The Product has been used, tested or altered;',
                'The request is made after the 3-day window has expired; or',
                'The damage is caused by mishandling or improper storage after delivery.',
              ]}
            />
          </div>
        </Clause>
        <Clause n="8.6" title="Inspection and refund">
          Once your request is received and inspected by our quality team, we will notify you by email or phone
          whether it has been approved or rejected. If approved, we will send a replacement or process a refund to
          your original method of payment (or to your bank account / UPI for Cash on Delivery Orders) within 5–7
          working days. Your bank may take additional time to credit the amount.
        </Clause>
        <Clause n="8.7" title="Shipping charges">
          If the Product was damaged, broken, leaking, incorrect or expired, shipping charges paid at the time of
          purchase are refunded in full. For a return without a reason under 8.2, shipping charges are non-refundable
          and only the Product price is refunded.
        </Clause>
        <Clause n="8.8" title="Cancellations">
          Orders can be cancelled only before they are dispatched from our warehouse. Once shipped, an Order cannot be
          cancelled, but you may apply for a return on delivery, subject to the conditions above.
        </Clause>
        <Clause n="8.9" title="Adverse skin reaction">
          A skin reaction is not covered by this policy, but please report it to us under section 4.6 so our team can
          review the case and the batch.
        </Clause>
        <Clause n="8.10">
          Nothing in this section limits any right you have under the Consumer Protection Act, 2019 in relation to
          defective goods.
        </Clause>
        <Callout>
          <strong className="text-[#13382B]">Need help?</strong> For any questions or to raise a valid return request,
          contact our support team at <EmailLink /> or <PhoneLink />.
        </Callout>
      </>
    ),
  },
  {
    id: 'professional',
    title: 'Salon, Professional and Distributor Purchases',
    icon: <Store />,
    content: (
      <>
        <Clause n="9.1">
          Hydra 24n Products are also sold and used in treatments by authorised Professional Partners. A list of
          authorised Professional Partners is available on request at <EmailLink />.
        </Clause>
        <Clause n="9.2">
          Purchases made at a salon, spa or distributor are made under that Professional Partner's own invoice. Returns
          and replacements for those purchases must be raised first with the Professional Partner, within the same
          3-day period and on the same grounds set out in section 8. We will support the Professional Partner in
          resolving genuine product complaints.
        </Clause>
        <Clause n="9.3">
          Treatments and facials carried out in a salon using our Products are services provided by that salon, not by
          Hydra 24n. The salon is responsible for consultation, patch testing, hygiene and the professional
          application of the Products. Any complaint about a service should be directed to the salon.
        </Clause>
        <Clause n="9.4">
          Professional-use and back-bar Products marked "For Professional Use Only" or "Not for Resale" may not be
          resold to consumers.
        </Clause>
        <Clause n="9.5">
          Pricing, credit terms, minimum order quantities and territories for Professional Partners are governed by a
          separate written agreement. If that agreement conflicts with these Terms, the agreement prevails for the
          Professional Partner.
        </Clause>
        <Clause n="9.6">
          Products bought from sellers who are not authorised by us are not covered by these Terms, and we cannot
          guarantee their authenticity, storage or expiry.
        </Clause>
      </>
    ),
  },
  {
    id: 'ip',
    title: 'Intellectual Property',
    icon: <ShieldCheck />,
    content: (
      <>
        <Clause n="10.1">
          The Hydra 24n name, wave logo, "Professional Beauty" mark, the tagline "Where Hydration Meets Radiance.",
          product names, packaging designs, label artwork, photographs, magazine pages, text, graphics and all other
          content on the Website are owned by or licensed to Zulynz Beauty Global Private Limited and are protected by
          Indian and international trademark, copyright and design laws. Trademark No.: 7657601
        </Clause>
        <Clause n="10.2">
          You may view and print content from the Website for personal, non-commercial use only. You may not copy,
          reproduce, modify, distribute, sell or use any of our content, logos or product images for any commercial
          purpose, including on marketplaces, social media stores or competing products, without our prior written
          permission.
        </Clause>
        <Clause n="10.3">
          Professional Partners may use our logo and marketing material only as approved in writing and only to
          promote genuine Hydra 24n Products.
        </Clause>
      </>
    ),
  },
  {
    id: 'conduct',
    title: 'User Conduct, Reviews and Content',
    icon: <MessageSquare />,
    content: (
      <>
        <Clause n="11.1">
          You agree not to use the Website to: break any law; upload harmful code or viruses; attempt to gain
          unauthorised access to our systems; scrape or copy content in bulk; impersonate any person; or post content
          that is false, defamatory, obscene, hateful or infringes anyone's rights.
        </Clause>
        <Clause n="11.2">
          Reviews, ratings, photos and comments you submit must be honest and based on your own genuine use of the
          Product. Paid, incentivised or fake reviews are not permitted. In line with the Bureau of Indian Standards'
          guidelines on online consumer reviews (IS 19000:2022), we do not edit reviews to change their meaning and may
          remove reviews that breach these Terms.
        </Clause>
        <Clause n="11.3">
          By submitting content, you give us a non-exclusive, royalty-free, worldwide licence to display and use it on
          the Website and in our marketing, with credit where reasonable. We will ask for your separate consent before
          using your face or before-and-after photos in advertising.
        </Clause>
      </>
    ),
  },
  {
    id: 'liability',
    title: 'Disclaimers, Limitation of Liability and Indemnity',
    icon: <AlertCircle />,
    content: (
      <>
        <Clause n="12.1">
          The Website and its content are provided "as is" for general information. Skincare information on the
          Website is not medical advice and is not a substitute for consultation with a dermatologist or doctor.
        </Clause>
        <Clause n="12.2">
          We do not guarantee that the Website will always be available, uninterrupted or free of errors, and we may
          suspend it for maintenance or updates.
        </Clause>
        <Clause n="12.3">
          To the fullest extent permitted by law, we are not liable for any indirect, incidental or consequential
          loss, including loss of income, business or opportunity, arising from use of the Website or the Products. We
          are also not liable for any reaction or harm resulting from failure to follow the patch-test, usage and
          storage instructions, use after the expiry date, or use of Products bought from unauthorised sellers.
        </Clause>
        <Clause n="12.4">
          Our total liability for any claim relating to an Order is limited to the amount you paid for the Product
          concerned.
        </Clause>
        <Clause n="12.5">
          Nothing in these Terms excludes or limits any liability that cannot be excluded under Indian law, including
          liability under the Consumer Protection Act, 2019 for defective products.
        </Clause>
        <Clause n="12.6">
          You agree to indemnify Hydra 24n against any claims, losses or costs arising from your breach of these Terms,
          your misuse of the Website or Products, or your violation of any law or third-party right.
        </Clause>
      </>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy',
    icon: <Lock />,
    content: (
      <>
        <Clause n="13.1">
          We collect and use your personal data, such as your name, phone number, email, delivery address and order
          history, only to process Orders, provide customer support, prevent fraud and, with your consent, send you
          offers.
        </Clause>
        <Clause n="13.2">
          We handle personal data in accordance with the Digital Personal Data Protection Act, 2023 and our{' '}
          {privacyLink}, which forms part of these Terms. We share data only with service providers needed to fulfil
          your Order (such as payment gateways and courier partners) or where required by law.
        </Clause>
        <Clause n="13.3">
          You may unsubscribe from marketing messages at any time, and may request access to, correction of or
          deletion of your personal data by writing to <EmailLink />.
        </Clause>
      </>
    ),
  },
  {
    id: 'grievance',
    title: 'Grievance Redressal',
    icon: <Headphones />,
    content: (
      <>
        <Clause n="14.1">
          In accordance with the Consumer Protection (E-Commerce) Rules, 2020 and the Information Technology Act, 2000,
          we have appointed a Grievance Officer:
        </Clause>
        <InfoTable
          rows={[
            ['Name', 'Anuraj'],
            ['Designation', 'Grievance Manager'],
            ['Address', ADDRESS],
            ['Email', <EmailLink email="rkanungo@hydra24n.com" />],
            ['Phone', <PhoneLink />],
            ['Working hours', 'All days of the week, 9:00 AM – 5:00 PM IST'],
          ]}
        />
        <Clause n="14.2">
          We will acknowledge your complaint within 48 hours of receipt and aim to resolve it within one month.
        </Clause>
        <Clause n="14.3">
          If you are not satisfied with our resolution, you may approach the National Consumer Helpline (dial 1915 or
          visit{' '}
          <a
            href="https://consumerhelpline.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#13382B] font-medium underline decoration-[#C5A880] underline-offset-2"
          >
            consumerhelpline.gov.in
          </a>
          ) or the appropriate Consumer Disputes Redressal Commission.
        </Clause>
      </>
    ),
  },
  {
    id: 'governing-law',
    title: 'Governing Law, Jurisdiction and Force Majeure',
    icon: <Gavel />,
    content: (
      <>
        <Clause n="15.1">These Terms are governed by the laws of India.</Clause>
        <Clause n="15.2">
          Subject to your rights as a consumer to approach a Consumer Commission under the Consumer Protection Act,
          2019, the courts at Bhubaneswar, Odisha shall have exclusive jurisdiction over any dispute arising from these
          Terms or your use of the Website.
        </Clause>
        <Clause n="15.3">
          We are not responsible for any delay or failure to perform our obligations caused by events beyond our
          reasonable control, including natural disasters, epidemics, government orders, strikes, courier disruptions,
          internet or power failures.
        </Clause>
        <Clause n="15.4">
          If any provision of these Terms is found invalid or unenforceable, the remaining provisions will continue in
          full force. Our failure to enforce any right does not waive that right.
        </Clause>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to These Terms and Contact',
    icon: <Mail />,
    content: (
      <>
        <Clause n="16.1">
          We may update these Terms from time to time. The updated version will be posted on this page with a new
          "Last updated" date. Orders placed before an update are governed by the Terms in force when the Order was
          placed.
        </Clause>
        <Clause n="16.2">Continued use of the Website after an update means you accept the revised Terms.</Clause>
        <Clause n="16.3">For any questions about these Terms, contact us:</Clause>
        <ContactCard subtitle="(Hydra 24n Professional Beauty)" />
      </>
    ),
  },
];

export const TermsConditions: React.FC = () => (
  <LegalLayout
    icon={<FileText />}
    title="Terms & Conditions"
    updated="05 October 2026"
    intro="The terms that govern your use of www.hydra24n.com and your purchase of Hydra 24n Professional Beauty products, online or through an authorised salon or distributor."
    highlights={[
      { icon: <Scale />, title: 'Governed by Indian Law', desc: 'Courts at Bhubaneswar, Odisha' },
      { icon: <FlaskConical />, title: 'Licensed Cosmetics', desc: 'Mfg. Licence 265 COS (H)' },
      { icon: <Headphones />, title: 'Grievance in 48 hrs', desc: 'Acknowledged within 48 hours' },
    ]}
    sections={sections}
  />
);
