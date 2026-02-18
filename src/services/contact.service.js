const nodemailer = require("nodemailer");
const prisma = require("../prisma.js");

exports.sendEmail = async ({ name, email, subject, message }) => {

  await prisma.contact.create({
    data: {
      name,
      email,
      subject,
      message,
    },
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"GoWithGuide Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECEIVER,
    replyTo: email,
    subject: subject || "มีข้อความติดต่อใหม่",
    html: `
      <h3>มีข้อความติดต่อใหม่</h3>
      <p><strong>ชื่อ:</strong> ${name}</p>
      <p><strong>อีเมลลูกค้า:</strong> ${email}</p>
      <p><strong>หัวข้อ:</strong> ${subject || "-"}</p>
      <p><strong>ข้อความ:</strong></p>
      <p>${message}</p>
    `,
  });
};
