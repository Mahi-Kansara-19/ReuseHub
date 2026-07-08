const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html, text }) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.warn("⚠️ [EMAIL NOT CONFIG] EMAIL_USER or EMAIL_PASS environment variables are missing.");
    console.log(`[SIMULATED EMAIL LOG] To: ${to}\nSubject: ${subject}\nBody: ${text || html}`);
    return { simulated: true };
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const mailOptions = {
    from: `"ReuseHub" <${emailUser}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 [EMAIL SENT] Message sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ [EMAIL ERROR] Failed to send email via SMTP transporter:", error);
    throw error;
  }
};

module.exports = sendEmail;
