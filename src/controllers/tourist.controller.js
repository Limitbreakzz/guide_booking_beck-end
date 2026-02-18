const prisma = require("../prisma.js");
const multer = require("multer");
const bcrypt = require("bcrypt");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop(),
    );
  },
});
const upload = multer({ storage: storage });

exports.getTourists = async (req, res) => {
  try {
    const tourists = await prisma.tourist.findMany({
      where: { role: "tourist" },
    });

    res.json({
      status: "success",
      message: "Tourists retrieved successfully",
      data: tourists,
    });
  } catch (error) {
    console.error("Error fetching tourists:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getTouristById = async (req, res) => {
  const touristId = parseInt(req.params.id, 10);
  if (isNaN(touristId))
    return res.status(400).json({
      status: "error",
      message: "Invalid tourist id",
    });

  try {
    const tourist = await prisma.tourist.findUnique({
      where: { id: touristId },
    });

    if (!tourist) {
      return res.status(404).json({
        status: "error",
        message: "Tourist not found",
      });
    }

    res.json({
      status: "success",
      message: "Tourist retrieved successfully",
      data: tourist,
    });
  } catch (error) {
    console.error("Error fetching tourist:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.createTourist = async (req, res) => {
  upload.single("picture")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        message: "Upload Picture Failed",
        error: { detail: "Unable to create tourist" },
      });
    }

    const { name, email, password, tel } = req.body;
    const picture = req.file ? req.file.filename : null;
    const exists = await prisma.tourist.findUnique({ where: { email } });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (exists) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }

    try {
      const tourist = await prisma.tourist.create({
        data: {
          name,
          email,
          password: hashedPassword,
          tel,
          picture,
          role: "TOURIST",
        },
      });

      res.status(201).json({
        status: "success",
        message: "Tourist created successfully",
        data: tourist,
      });
    } catch (error) {
      console.error("Error creating tourist:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  });
};

exports.updateTourist = async (req, res) => {
  upload.single("picture")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        message: "Update Picture Failed",
      });
    }

    const touristId = parseInt(req.params.id, 10);
    const { name, email, tel } = req.body;

    try {
      const existingTourist = await prisma.tourist.findUnique({
        where: { id: touristId },
      });

      if (!existingTourist) {
        return res.status(404).json({
          status: "error",
          message: "Tourist not found",
        });
      }
      
      let pictureName = existingTourist.picture;

      if (req.file) {
        pictureName = req.file.filename;
      }

      const tourist = await prisma.tourist.update({
        where: { id: touristId },
        data: {
          name,
          email,
          tel,
          picture: pictureName,
        },
      });

      res.json({
        status: "success",
        message: "Tourist updated successfully",
        data: tourist,
      });
    } catch (error) {
      console.error("Error updating tourist:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  });
};

exports.deleteTourist = async (req, res) => {
  const touristId = parseInt(req.params.id, 10);

  if (isNaN(touristId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid tourist id",
    });
  }

  try {
    await prisma.booking.deleteMany({
      where: { touristId: touristId },
    });

    await prisma.tourist.delete({
      where: { id: touristId },
    });

    res.json({
      status: "success",
      message: "Tourist deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting tourist:", error);

    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

