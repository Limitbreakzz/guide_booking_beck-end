const contactService = require("../services/contact.service");

exports.sendContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      message: "กรุณากรอกข้อมูลให้ครบ",
    });
  }

  try {
    await contactService.sendEmail({ name, email, subject, message });

    res.json({ message: "ส่งข้อความสำเร็จแล้ว" });
  } catch (error) {
    res.status(500).json({ message: "ส่งข้อความไม่สำเร็จ" });
  }
};
