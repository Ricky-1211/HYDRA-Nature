import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Clock, MapPin, Package, AlertTriangle, Phone, Receipt, KeyRound, Ban, Video } from 'lucide-react';
import { LegalLayout, LegalSection, Callout, BulletList, CheckList, ContactCard } from './legal/LegalLayout';

const returnsLink = (
  <Link to="/returns" className="text-[#13382B] font-medium underline decoration-[#C5A880] underline-offset-2">
    Return and Refund Policy
  </Link>
);

const sections: LegalSection[] = [
  {
    id: 'locations',
    title: 'Shipping Locations',
    icon: <MapPin />,
    content: <p>We currently deliver within India only, to pin codes serviced by our courier partners.</p>,
  },
  {
    id: 'timeline',
    title: 'Delivery Timeline',
    icon: <Clock />,
    content: (
      <>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#FAF8F5] border border-[#EDE8E1] rounded-xl p-4 text-center">
            <p className="font-serif text-2xl font-semibold text-[#13382B]">5–7</p>
            <p className="text-xs text-gray-500">working days, usually</p>
          </div>
          <div className="bg-[#FAF8F5] border border-[#EDE8E1] rounded-xl p-4 text-center">
            <p className="font-serif text-2xl font-semibold text-[#13382B]">15</p>
            <p className="text-xs text-gray-500">days, at the latest</p>
          </div>
        </div>
        <p>These timelines are estimates.</p>
        <Callout>
          Delays caused by couriers, weather, public holidays or events outside our control do not entitle you to
          cancel a dispatched Order, though we will help you track it.
        </Callout>
      </>
    ),
  },
  {
    id: 'charges',
    title: 'Shipping Charges',
    icon: <Receipt />,
    content: <p>Shipping charges, if any, are shown separately at checkout before you pay.</p>,
  },
  {
    id: 'ownership',
    title: 'Delivery and Ownership',
    icon: <KeyRound />,
    content: (
      <BulletList
        items={['Risk in the Products passes to you on delivery.', 'Ownership passes once full payment is received.']}
      />
    ),
  },
  {
    id: 'inspection',
    title: 'Parcel Inspection at Delivery',
    icon: <Package />,
    content: (
      <>
        <p>Check your parcel on delivery. Do not accept a parcel that is visibly:</p>
        <div className="max-w-md">
          <div className="grid grid-cols-2 gap-3">
            <CheckList variant="no" items={['Torn.', 'Crushed.']} />
            <CheckList variant="no" items={['Wet.', 'Tampered with.']} />
          </div>
        </div>
        <Callout tone="sage">
          <p className="flex items-start gap-2">
            <Video className="w-4 h-4 text-[#3F6352] flex-shrink-0 mt-0.5" />
            <span>
              We strongly recommend recording a <strong>continuous, unedited unboxing video</strong> from the sealed
              parcel to the Products, as this will be needed for any claim under our {returnsLink}.
            </span>
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: 'failed-delivery',
    title: 'Failed Delivery Attempts',
    icon: <AlertTriangle />,
    content: (
      <>
        <p>
          If delivery fails because of an incorrect address or because you were unavailable or refused the parcel
          without valid reason:
        </p>
        <BulletList
          items={[
            'Re-delivery charges may apply.',
            'The Order may be cancelled with the shipping charge deducted from any refund.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'cancellation',
    title: 'Cancellation After Dispatch',
    icon: <Ban />,
    content: (
      <>
        <p>Once an Order has been dispatched, it cannot be cancelled.</p>
        <p>
          You may apply for a return after delivery, subject to the eligibility requirements and conditions of our{' '}
          {returnsLink}.
        </p>
      </>
    ),
  },
  {
    id: 'assistance',
    title: 'Delivery-Related Assistance',
    icon: <Phone />,
    content: (
      <>
        <p>For assistance with shipping or delivery, contact:</p>
        <ContactCard showAddress={false} />
      </>
    ),
  },
];

export const ShippingPolicy: React.FC = () => (
  <LegalLayout
    icon={<Truck />}
    title="Shipping & Delivery Policy"
    updated="05 October 2026"
    intro="Where we deliver, how long it takes, and what to check when your Hydra 24n parcel arrives."
    highlights={[
      { icon: <MapPin />, title: 'India Only', desc: 'Serviceable pin codes' },
      { icon: <Clock />, title: '5–7 Working Days', desc: 'Within 15 days at most' },
      { icon: <Receipt />, title: 'Charges at Checkout', desc: 'Shown before you pay' },
    ]}
    sections={sections}
  />
);
