import nodemailer from 'nodemailer';

export const sendOrderEmail = async (user, order, items) => {
  // Config
  // Check for email configuration
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(`[EMAIL] Skipping email for Order #${order.id}: EMAIL_USER and EMAIL_PASS are not configured in .env.`);
    return;
  }

  const transporter = nodemailer.createTransport({
    // For a real app, use Gmail/Outlook/SendGrid settings in .env
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  });

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <img src="${item.image_url}" width="60" style="vertical-align: middle; margin-right: 15px;" />
        <span style="font-weight: bold; color: #111;">${item.name}</span>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.quantity} x ${currencyFormatter.format(item.priceAtTime)}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: '"Amazon Clone Support" <support@amazon-clone.in>',
    to: user.email,
    subject: `Order Confirmation - #${order.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #232f3e; padding: 20px; text-align: center;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" width="100" style="filter: brightness(0) invert(1);" />
          <span style="color: white; font-size: 14px; vertical-align: bottom;">.in</span>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #c45500; font-weight: normal; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Confirmation</h2>
          <p style="font-size: 16px; color: #111;">Hello, ${user.name.split(' ')[0]}!</p>
          <p style="color: #444; line-height: 1.6;">Thank you for shopping with us. We'll send a confirmation when your items ship.</p>
          
          <div style="background: #f7f7f7; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px;"><b>Order ID:</b> #${order.id}</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;"><b>Delivery to:</b> ${order.shippingAddress}</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f0f2f2;">
                <th style="padding: 10px; text-align: left; font-size: 13px;">Item</th>
                <th style="padding: 10px; text-align: right; font-size: 13px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 15px 10px; text-align: right; font-weight: bold;">Grand Total:</td>
                <td style="padding: 15px 10px; text-align: right; font-weight: bold; font-size: 18px; color: #B12704;">
                  ${currencyFormatter.format(order.totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="http://localhost:5173/orders/${order.id}/track" style="background: #FFD814; border: 1px solid #FCD200; border-radius: 8px; color: #111; padding: 12px 24px; text-decoration: none; font-size: 14px; font-weight: bold;">Track your package</a>
          </div>
        </div>
        
        <div style="background: #f0f2f2; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>© 1996-2026, Amazon.com, Inc. or its affiliates</p>
          <div style="margin-top: 10px;">
            <a href="#" style="color: #0066c0; margin: 0 10px; text-decoration: none;">Conditions of Use</a>
            <a href="#" style="color: #0066c0; margin: 0 10px; text-decoration: none;">Privacy Notice</a>
            <a href="#" style="color: #0066c0; margin: 0 10px; text-decoration: none;">Help</a>
          </div>
        </div>
      </div>
    `
  };

  if (!user.email) {
    console.warn(`[EMAIL] Skipping email for Order #${order.id}: User has no email address.`);
    return;
  }

  try {
    // Attempt sending
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Confirmation sent to ${user.email} for Order #${order.id}`);
  } catch (error) {
    // If it fails (like mock creds), log it but don't crash order flow
    console.error(`[EMAIL ERROR] Failed to send email to ${user.email}:`, error.message);
  }
};
