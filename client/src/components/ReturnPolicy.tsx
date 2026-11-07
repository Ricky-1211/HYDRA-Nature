import React from 'react';
import {
  RotateCcw, CheckCircle, XCircle, CreditCard, AlertTriangle, Camera, Store, Phone, Clock, Send, Truck, Scale, Ban,
} from 'lucide-react';
import {
  LegalLayout, LegalSection, Callout, CheckList, BulletList, Panel, InfoTable, EmailLink, PhoneLink, ContactCard,
} from './legal/LegalLayout';

const sections: LegalSection[] = [
  {
    id: 'window',
    title: 'Return Eligibility Window — 3 Days',
    icon: <Clock />,
    content: (
      <>
        <p>
          You may raise a return or replacement request within <strong>3 (three) days</strong> from the date and time
          of successful delivery, as recorded by our courier partner.
        </p>
        <Callout>Requests raised after this window will not be accepted.</Callout>
      </>
    ),
  },
  {
    id: 'reasons',
    title: 'Reasons for Return or Replacement',
    icon: <CheckCircle />,
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Panel title="Accepted if you receive">
          <CheckList
            items={[
              <>A physically <strong>damaged, broken or leaking</strong> Product.</>,
              <>An <strong>incorrect Product</strong>, different from what was ordered.</>,
              <>An <strong>expired</strong> Product.</>,
            ]}
          />
        </Panel>
        <Panel title="Return without giving a reason">
          <p className="text-gray-600 mb-3">Within the same 3-day window, provided the Product is:</p>
          <CheckList items={['Unopened.', 'Unused.', 'In its original sealed packaging.']} />
          <p className="text-xs text-gray-500 mt-4 pt-3 border-t border-[#EDE8E1]">
            The Product price will be refunded, but shipping charges will not.
          </p>
        </Panel>
      </div>
    ),
  },
  {
    id: 'proof',
    title: 'Proof Required',
    icon: <Camera />,
    content: (
      <Callout tone="sage">
        For damaged, broken, leaking, incorrect or expired Products, clear photographs or video of the unboxing and of
        the defective Product must be shared at the time of raising the request.
      </Callout>
    ),
  },
  {
    id: 'how-to',
    title: 'How to Raise a Return Request',
    icon: <Send />,
    content: (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            ['Contact us', <>Email <EmailLink /> or call / WhatsApp <PhoneLink />.</>],
            ['Share details', 'Include your Order number.'],
            ['Attach proof', 'Add the required photographs or unboxing video.'],
          ].map(([title, desc], i) => (
            <div key={i} className="bg-[#FAF8F5] border border-[#EDE8E1] rounded-xl p-4">
              <span className="w-7 h-7 rounded-full bg-[#13382B] text-white text-xs font-bold flex items-center justify-center mb-3">
                {i + 1}
              </span>
              <p className="font-semibold text-[#13382B] mb-1">{title}</p>
              <p className="text-xs text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'non-returnable',
    title: 'Non-Returnable and Non-Refundable Products',
    icon: <XCircle />,
    content: (
      <>
        <p>To protect health, safety and hygiene, Products cannot be returned or refunded if:</p>
        <CheckList
          variant="no"
          items={[
            <>
              The <strong>safety seal, outer plastic wrap or cap/lid</strong> has been opened, broken or tampered with
              after delivery. Once a seal is broken, the Product is strictly non-returnable, unless it arrived damaged
              and this is shown in the unboxing proof.
            </>,
            <>The Product has been <strong>used, tested or altered</strong>.</>,
            <>The request is made <strong>after the 3-day window</strong> has expired.</>,
            <>The damage is caused by <strong>mishandling or improper storage</strong> after delivery.</>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'refund',
    title: 'Inspection and Refund Processing',
    icon: <CreditCard />,
    content: (
      <>
        <p>
          Once your request is received and inspected by our quality team, we will notify you by email or phone
          whether it has been approved or rejected.
        </p>
        <p>
          If approved, we will send a replacement or process a refund to your original method of payment (or to your
          bank account / UPI for Cash on Delivery Orders) within <strong>5–7 working days</strong>.
        </p>
        <p className="text-xs text-gray-500">Your bank may take additional time to credit the amount.</p>
      </>
    ),
  },
  {
    id: 'shipping-charges',
    title: 'Shipping Charges on Returns',
    icon: <Truck />,
    content: (
      <InfoTable
        head={['Return type', 'What is refunded']}
        rows={[
          ['Damaged, broken, leaking, incorrect or expired', 'Product price + shipping charges, in full'],
          ['Return without a reason', 'Product price only — shipping charges are non-refundable'],
        ]}
      />
    ),
  },
  {
    id: 'cancellation',
    title: 'Order Cancellation Policy',
    icon: <Ban />,
    content: (
      <BulletList
        items={[
          <>Orders can be cancelled only <strong>before they are dispatched</strong> from our warehouse.</>,
          <>
            You may cancel an Order free of charge before dispatch by writing to <EmailLink /> or using the cancel
            option in your account.
          </>,
          'Once shipped, an Order cannot be cancelled, but you may apply for a return on delivery, subject to the conditions above.',
          <>
            Refunds for cancelled prepaid Orders are made to the original payment method within{' '}
            <strong>5–7 working days</strong> of cancellation.
          </>,
        ]}
      />
    ),
  },
  {
    id: 'skin-reactions',
    title: 'Adverse Skin Reactions',
    icon: <AlertTriangle />,
    content: (
      <Callout>
        <p className="mb-2">A skin reaction is not covered by this Return and Refund Policy.</p>
        <p>
          However, please report any adverse reaction to <EmailLink /> with your Order number and batch number so our
          team can review the case and the batch.
        </p>
      </Callout>
    ),
  },
  {
    id: 'salon',
    title: 'Salon, Professional and Distributor Purchases',
    icon: <Store />,
    content: (
      <>
        <p>Purchases made at a salon, spa or distributor are made under that Professional Partner's own invoice.</p>
        <p>
          Returns and replacements for those purchases must be raised first with the Professional Partner, within the
          same 3-day period and on the same grounds set out in this policy.
        </p>
        <p>We will support the Professional Partner in resolving genuine product complaints.</p>
      </>
    ),
  },
  {
    id: 'consumer-rights',
    title: 'Consumer Rights',
    icon: <Scale />,
    content: (
      <p>
        Nothing in this policy limits any right you have under the <strong>Consumer Protection Act, 2019</strong> in
        relation to defective goods.
      </p>
    ),
  },
  {
    id: 'support',
    title: 'Customer Support',
    icon: <Phone />,
    content: (
      <>
        <p>For questions or to raise a valid return request, contact:</p>
        <ContactCard showAddress={false} />
      </>
    ),
  },
];

export const ReturnPolicy: React.FC = () => (
  <LegalLayout
    icon={<RotateCcw />}
    title="Return & Refund Policy"
    updated="05 October 2026"
    intro={
      <>
        At Hydra 24n, we take pride in the quality and safety of our professional beauty and skincare formulations.
        Because our Products are applied to the skin, we maintain strict quality-control and hygiene standards. By
        placing an Order, you agree to this Return and Refund Policy.
      </>
    }
    highlights={[
      { icon: <Clock />, title: '3-Day Window', desc: 'From successful delivery' },
      { icon: <CreditCard />, title: '5–7 Working Days', desc: 'Refund after approval' },
      { icon: <Camera />, title: 'Unboxing Proof', desc: 'Needed for damage claims' },
    ]}
    sections={sections}
  />
);
