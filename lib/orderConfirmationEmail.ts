import nodemailer from "nodemailer";
import { CustomerDetails, OrderItem } from "@/types/order";

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

export async function sendOrderConfirmationEmail(customerDetails: CustomerDetails, order: { items: OrderItem[], totalAmount: number }) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerDetails.email, // Customer's email
    subject: "Order Confirmation",
    html: `
      <h1>Order Confirmation</h1>
      <p>Hi ${customerDetails.firstName},</p>
      <p>Thank you for your order! Here are the details:</p>
      <ul>
        ${order.items.map((item: OrderItem) => `
          <li>
            ${item.name} - ${item.quantity} x ${item.price} (${item.color}, ${item.size})
          </li>
        `
          )
          .join("")}
      </ul>
      <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
      <p>We will notify you once your order is shipped!</p>
      <p>Thank you for shopping with us!</p>
    `,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    if (error instanceof Error) {
    console.error("Error sending email:", error);
    }
  }
}