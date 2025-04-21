import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", // Correct SMTP server address
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.BREVO_EMAIL, // Brevo account email
    pass: process.env.BREVO_API_KEY, // Use the API key, not SMTP password
  },
});

export async function sendEmail(to: string, link: string) {
  try {
    console.log(to, link);
    console.log(process.env.BREVO_EMAIL, process.env.BREVO_API_KEY);
    await transporter.sendMail({
      from: `"Your App" <${process.env.BREVO_EMAIL}>`,
      to,
      subject: "You're invited – set your password",
      html: `
        <p>Welcome! Click the link below to set your password:</p>
        <a href="${link}">${link}</a>
      `,
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
