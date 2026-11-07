import React from 'react';
import { Shield, Eye, Lock, Bell, UserCheck, CreditCard, Mail, Database, Truck, Ban } from 'lucide-react';
import {
  LegalLayout, LegalSection, Callout, BulletList, Panel, EmailLink, ContactCard,
} from './legal/LegalLayout';

const sections: LegalSection[] = [
  {
    id: 'collection',
    title: 'Collection and Use of Personal Information',
    icon: <Eye />,
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Panel title="What we collect">
          <BulletList items={['Full name', 'Phone number', 'Email address', 'Delivery address', 'Order history']} />
        </Panel>
        <Panel title="We use it only to">
          <BulletList
            items={[
              'Process and fulfil your orders.',
              'Provide customer support.',
              'Prevent fraudulent transactions.',
              'Send promotional offers and marketing communications with your consent.',
            ]}
          />
        </Panel>
      </div>
    ),
  },
  {
    id: 'protection',
    title: 'Data Protection and Privacy',
    icon: <Lock />,
    content: (
      <>
        <p>
          We handle personal data in accordance with the <strong>Digital Personal Data Protection Act, 2023</strong>,
          and our Privacy Policy.
        </p>
        <Callout tone="sage">
          We share personal data only with service providers necessary to fulfil your order, such as payment gateways
          and courier partners, or where required by law.
        </Callout>
      </>
    ),
  },
  {
    id: 'marketing',
    title: 'Marketing Communications',
    icon: <Bell />,
    content: <p>You may unsubscribe from marketing messages at any time.</p>,
  },
  {
    id: 'rights',
    title: 'Your Personal Data Rights',
    icon: <UserCheck />,
    content: (
      <>
        <p>You may request:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: <Database className="w-4 h-4" />, label: 'Access', desc: 'Access to your personal data.' },
            { icon: <UserCheck className="w-4 h-4" />, label: 'Correction', desc: 'Correction of your personal information.' },
            { icon: <Ban className="w-4 h-4" />, label: 'Deletion', desc: 'Deletion of your personal data.' },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="bg-[#FAF8F5] border border-[#EDE8E1] rounded-xl p-4">
              <div className="w-8 h-8 rounded-full bg-[#EAF1EB] text-[#13382B] flex items-center justify-center mb-2">
                {icon}
              </div>
              <p className="font-semibold text-[#13382B] text-sm">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
        <p>
          To submit a request, please contact <EmailLink />.
        </p>
      </>
    ),
  },
  {
    id: 'payment',
    title: 'Payment Information',
    icon: <CreditCard />,
    content: (
      <>
        <p>Online payments are processed through our payment partner, <strong>Razorpay</strong>.</p>
        <Callout>We do not store your debit or credit card details.</Callout>
      </>
    ),
  },
  {
    id: 'contact',
    title: 'Contact Information',
    icon: <Mail />,
    content: <ContactCard />,
  },
];

export const PrivacyPolicy: React.FC = () => (
  <LegalLayout
    icon={<Shield />}
    title="Privacy Policy"
    updated="05 October 2026"
    intro={
      <>
        How Zulynz Beauty Global Private Limited collects, uses and protects your personal information when you use
        www.hydra24n.com and shop with Hydra 24n.
      </>
    }
    highlights={[
      { icon: <Lock />, title: 'DPDP Act, 2023', desc: 'Your data handled lawfully' },
      { icon: <Truck />, title: 'Shared Only to Deliver', desc: 'Payment & courier partners' },
      { icon: <CreditCard />, title: 'No Card Storage', desc: 'Payments secured by Razorpay' },
    ]}
    sections={sections}
  />
);
