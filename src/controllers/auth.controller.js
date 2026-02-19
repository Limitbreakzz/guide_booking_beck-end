const bcrypt = require("bcrypt");
const prisma = require("../prisma");
const authService = require("../services/auth.service");

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      tel,
      language,
      experience,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["TOURIST", "GUIDE"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (role === "GUIDE") {
      if (!tel) {
        return res
          .status(400)
          .json({ message: "Tel is required for guide" });
      }

      if (!/^0[0-9]{9}$/.test(tel)) {
        return res.status(400).json({
          message: "Tel must be 10 digits and start with 0",
        });
      }
    }

    let existingUser;
    if (role === "TOURIST") {
      existingUser = await prisma.tourist.findUnique({ where: { email } });
    } else {
      existingUser = await prisma.guide.findUnique({ where: { email } });
    }

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;

    if (role === "TOURIST") {
      user = await prisma.tourist.create({
        data: {
          name,
          email,
          password: hashedPassword,
          tel: tel || null,
        },
      });
    }

    else {
      user = await prisma.guide.create({
        data: {
          name,
          email,
          password: hashedPassword,
          tel: tel || null,
          language: language || null,
          experience: experience || null,
          status: true,
        },
      });
    }

    const token = authService.generateToken({
      id: user.id,
      role,
    });

    res.status(201).json({
      message: "Register success",
      status: "success",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = null;
    let role = null;

    user = await prisma.admin.findUnique({ where: { email } });
    if (user) role = "ADMIN";

    if (!user) {
      user = await prisma.tourist.findUnique({ where: { email } });
      if (user) role = "TOURIST";
    }

    if (!user) {
      user = await prisma.guide.findUnique({ where: { email } });
      if (user) role = "GUIDE";
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = authService.generateToken({
      id: user.id,
      role,
    });

    res.json({
      message: "Login success",
      status: "success",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
