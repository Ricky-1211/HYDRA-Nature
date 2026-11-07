import { Order } from '../types';

/**
 * Generates and triggers instant print-to-PDF for a luxury skincare tax invoice
 */
export const downloadOrderInvoicePdf = (order: Order) => {
  const invoiceWindow = window.open('', '_blank');
  if (!invoiceWindow) {
    alert('Please allow popups to download your invoice PDF.');
    return;
  }

  const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const invoiceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>HYDRA Invoice #${order.orderNumber}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      color: #1A211D;
      background: #F8F6F2;
      padding: 40px 20px;
      -webkit-font-smoothing: antialiased;
    }
    .invoice-card {
      max-width: 820px;
      margin: 0 auto;
      background: #FFFFFF;
      border-radius: 20px;
      padding: 48px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.06);
      border: 1px solid #EAE5DC;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #13382B;
      padding-bottom: 24px;
      margin-bottom: 28px;
    }
    .brand-title {
      font-family: 'Playfair Display', serif;
      font-size: 34px;
      font-weight: 700;
      color: #13382B;
      letter-spacing: 2.5px;
    }
    .brand-tagline {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #6C7D73;
      margin-top: 4px;
    }
    .company-details {
      font-size: 11px;
      color: #7A8B80;
      line-height: 1.5;
      margin-top: 8px;
    }
    .invoice-info {
      text-align: right;
    }
    .invoice-info h2 {
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      color: #13382B;
    }
    .invoice-info p {
      font-size: 12px;
      color: #555;
      margin-top: 3px;
    }
    .paid-badge {
      display: inline-block;
      margin-top: 10px;
      padding: 6px 16px;
      background: #EAF1EB;
      color: #2E6B48;
      border: 1px solid #B8DAC2;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 32px;
      margin-bottom: 30px;
      padding-bottom: 24px;
      border-bottom: 1px dashed #DDD7CD;
    }
    .section-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #7A8B80;
      margin-bottom: 8px;
      font-weight: 700;
    }
    .meta-content {
      font-size: 13px;
      line-height: 1.6;
      color: #2D3732;
    }
    .table-items {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
    }
    .table-items th {
      background: #FAF8F5;
      color: #13382B;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 12px 14px;
      text-align: left;
      border-bottom: 1px solid #E6E1D8;
    }
    .table-items td {
      padding: 14px;
      font-size: 13px;
      border-bottom: 1px solid #F0ECE4;
      vertical-align: middle;
    }
    .summary-box {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 32px;
    }
    .summary-table {
      width: 320px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 13px;
      color: #555;
    }
    .summary-row.total {
      font-family: 'Playfair Display', serif;
      font-size: 19px;
      font-weight: 700;
      color: #13382B;
      border-top: 2px solid #13382B;
      padding-top: 10px;
      margin-top: 6px;
    }
    .footer {
      border-top: 1px solid #E6E1D8;
      padding-top: 20px;
      text-align: center;
      font-size: 11px;
      color: #7A8B80;
      line-height: 1.6;
    }
    .action-bar {
      max-width: 820px;
      margin: 0 auto 20px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .btn-print {
      padding: 10px 24px;
      background: #13382B;
      color: #FFFFFF;
      font-weight: 600;
      font-size: 13px;
      border-radius: 9999px;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(19,56,43,0.15);
    }
    @media print {
      body { background: #FFF; padding: 0; }
      .invoice-card { box-shadow: none; border: none; padding: 20px 0; }
      .action-bar { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="action-bar">
    <button onclick="window.print()" class="btn-print">🖨️ Print / Save PDF Invoice</button>
  </div>

  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="brand-title">HYDRA</div>
        <div class="brand-tagline">Nature • Science • Radiance</div>
        <div class="company-details">
          Hydra Luxury Botanical Skincare Private Ltd.<br>
          GSTIN: 27AABCH1234F1Z8 | FSSAI: 11522000000000<br>
          Bandra Kurla Complex, Mumbai, Maharashtra 400051
        </div>
      </div>
      <div class="invoice-info">
        <h2>TAX INVOICE</h2>
        <p><strong>Invoice No:</strong> INV-${order.orderNumber}</p>
        <p><strong>Order No:</strong> ${order.orderNumber}</p>
        <p><strong>Date:</strong> ${invoiceDate}</p>
        <div>
          <span class="paid-badge">${
            order.paymentMethod === 'cod'
              ? 'Cash on Delivery (To be Collected)'
              : '✓ Payment Completed (Prepaid)'
          }</span>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div>
        <div class="section-title">Shipping & Billing Address</div>
        <div class="meta-content">
          <p style="font-weight: 700; color: #13382B;">${order.shippingAddress.fullName}</p>
          <p>${order.shippingAddress.street}${order.shippingAddress.apartment ? ', ' + order.shippingAddress.apartment : ''}</p>
          <p>${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}</p>
          <p>${order.shippingAddress.country || 'India'}</p>
          <p style="margin-top: 4px;"><strong>Contact:</strong> ${order.shippingAddress.phone}</p>
        </div>
      </div>

      <div>
        <div class="section-title">Order Logistics & Payment</div>
        <div class="meta-content">
          <p><strong>Payment Gateway:</strong> Razorpay Official</p>
          <p><strong>Payment ID:</strong> ${order.paymentDetails?.razorpayPaymentId || 'Verified Online'}</p>
          <p><strong>Shiprocket Courier:</strong> ${order.shiprocket?.courierName || 'Priority Air Courier'}</p>
          <p><strong>AWB Tracking:</strong> ${order.shiprocket?.awbCode || order.trackingNumber || 'SR-PRIORITY-DISPATCH'}</p>
          <p><strong>Delivery Status:</strong> ${order.status}</p>
        </div>
      </div>
    </div>

    <table class="table-items">
      <thead>
        <tr>
          <th>#</th>
          <th>Formulation Item</th>
          <th>Size / Vol</th>
          <th>Qty</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${order.items
          .map(
            (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td><strong>${item.name}</strong></td>
            <td>${item.size || '50ml'}</td>
            <td>${item.quantity}</td>
            <td style="text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
            <td style="text-align: right; font-weight: 600;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <div class="summary-box">
      <div class="summary-table">
        <div class="summary-row">
          <span>Items Subtotal:</span>
          <span>₹${order.subtotal.toLocaleString('en-IN')}</span>
        </div>
        ${
          order.discount > 0
            ? `<div class="summary-row" style="color: #2E6B48;">
          <span>Voucher Discount (${order.couponCode || 'PROMO'}):</span>
          <span>-₹${order.discount.toLocaleString('en-IN')}</span>
        </div>`
            : ''
        }
        <div class="summary-row">
          <span>Express Courier Shipping:</span>
          <span style="color: #2E6B48; font-weight: 600;">FREE (All Orders)</span>
        </div>
        <div class="summary-row">
          <span>GST (Inclusive):</span>
          <span style="color: #2E6B48;">Included in Price (₹0)</span>
        </div>
        <div class="summary-row total">
          <span>Grand Total ${order.paymentMethod === 'cod' ? 'Payable' : 'Paid'}:</span>
          <span>₹${order.total.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for trusting Hydra Botanical Skincare formulations. Pure organic actives backed by clinical dermatology.</p>
      <p>For inquiries or skincare support, contact concierge@hydraskincare.com | +91 (800) 493-7200</p>
      <p style="margin-top: 6px; font-size: 10px; color: #AAA;">This is a digitally generated tax invoice authorized by Hydra Skincare Pvt Ltd.</p>
    </div>
  </div>

  <script>
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.print();
      }, 400);
    });
  </script>
</body>
</html>`;

  invoiceWindow.document.write(invoiceHtml);
  invoiceWindow.document.close();
};
