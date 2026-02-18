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

exports.getGuides = async (req, res) => {
  try {
    const guides = await prisma.guide.findMany({
      where: { role: "GUIDE" },
    });

    res.json({
      status: "success",
      message: "Guides retrieved successfully",
      data: guides,
    });
  } catch (error) {
    console.error("Error fetching guides:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getGuideByQuery = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword) {
      return res.json({
        status: "success",
        data: [],
      });
    }

    const guides = await prisma.guide.findMany({
      where: {
        OR: [
          {
            name: {
              contains: keyword,
            },
          },
          {
            language: {
              contains: keyword,
            },
          },
        ],
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json({
      status: "success",
      message: "Search guides successfully",
      data: guides,
    });
  } catch (error) {
    console.error("Search guide error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getGuideById = async (req, res) => {
  const guideId = parseInt(req.params.id, 10);
  if (isNaN(guideId))
    return res.status(400).json({
      status: "error",
      message: "Invalid guide id",
    });

  try {
    const guide = await prisma.guide.findUnique({
      where: { id: guideId },
      include: {
        trips: {
          where: { isActive: true },
          include: {
            province: true,
          },
        },
      },
    });

    if (!guide) {
      return res.status(404).json({
        message: "Guide not found",
      });
    }

    res.json({
      status: "success",
      message: "Guide retrieved successfully",
      data: guide,
    });
  } catch (error) {
    console.error("Error fetching guide:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.createGuide = async (req, res) => {
  upload.single("picture")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        message: "Upload Picture Failed",
        error: { detail: "Unable to create guide" },
      });
    }

    const { name, email, password, tel, experience, language } = req.body;
    const picture = req.file ? req.file.filename : null;
    const exists = await prisma.guide.findUnique({ where: { email } });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (exists) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }

    try {
      const guide = await prisma.guide.create({
        data: {
          name,
          email,
          password: hashedPassword,
          tel,
          role: "GUIDE",
          status: true,
          experience,
          language,
          picture,
        },
      });

      res.status(201).json({
        status: "success",
        message: "Guide created successfully",
        data: guide,
      });
    } catch (error) {
      console.error("Error creating guide:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  });
};

exports.updateGuide = async (req, res) => {
  upload.single("picture")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        message: "Update Picture Failed",
        error: { detail: "Unable to update guide" },
      });
    }

    const guideId = parseInt(req.params.id, 10);
    if (isNaN(guideId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid guide id",
      });
    }

    if (req.body.role !== undefined) {
      return res.status(400).json({
        status: "error",
        message: "Role cannot be updated",
      });
    }

    try {
      const existingGuide = await prisma.guide.findUnique({
        where: { id: guideId },
      });

      if (!existingGuide) {
        return res.status(404).json({
          status: "error",
          message: "Guide not found",
        });
      }

      const { name, email, password, tel, experience, language, status } =
        req.body;

      let pictureName = existingGuide.picture;

      if (req.file) {
        pictureName = req.file.filename;
      }

      const guide = await prisma.guide.update({
        where: { id: guideId },
        data: {
          name,
          email,
          password,
          tel,
          experience,
          language,
          picture: pictureName,
          status: status !== undefined ? status === "true" : undefined,
        },
      });

      res.json({
        status: "success",
        message: "Guide updated successfully",
        data: guide,
      });
    } catch (error) {
      console.error("Error updating guide:", error);

      if (error.code === "P2025") {
        return res.status(404).json({
          status: "error",
          message: "Guide not found",
        });
      }

      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  });
};

exports.deleteGuide = async (req, res) => {
  const guideId = parseInt(req.params.id, 10);

  if (isNaN(guideId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid guide id",
    });
  }

  try {
    await prisma.booking.deleteMany({
      where: { guideId: guideId },
    });

    await prisma.trip.deleteMany({
      where: { guideId: guideId },
    });

    await prisma.guide.delete({
      where: { id: guideId },
    });

    res.json({
      status: "success",
      message: "Guide deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting guide:", error);

    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
