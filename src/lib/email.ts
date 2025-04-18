import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_EMAIL, // your Brevo email
    pass: process.env.BREVO_SMTP_KEY, // SMTP password (generated in Brevo)
  },
});

export async function sendEmail(to: string, link: string) {
  try {
    console.log(to, link);
    await transporter.sendMail({
      from: `"Your App" <${process.env.BREVO_EMAIL}>`,
      to,
      subject: "You're invited – set your password",
      html: `
        <p>Welcome! Click the link below to set your password:</p>
        <a href="${link}">${link}</a>
      `,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
