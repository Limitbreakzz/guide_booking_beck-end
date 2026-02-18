const prisma = require("../prisma.js");
const multer = require("multer");
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

exports.getTrips = async (req, res) => {
  try {
    const { provinceId } = req.query;

    const trips = await prisma.trip.findMany({
      where: provinceId ? { provinceId: Number(provinceId) } : undefined,
      include: {
        province: true,
        guide: { select: { id: true, name: true } },
      },
    });

    res.json({
      status: "success",
      message: "Trips retrieved successfully",
      data: trips,
    });
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getTripsByQuery = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword) {
      return res.json({
        status: "success",
        data: [],
      });
    }

    const trips = await prisma.trip.findMany({
      where: {
        OR: [
          {
            name: {
              contains: keyword,
            },
          },
          {
            province: {
              name: {
                contains: keyword,
              },
            },
          },
        ],
      },
      include: {
        province: true,
        guide: { select: { id: true, name: true } },
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json({
      status: "success",
      message: "Search trips successfully",
      data: trips,
    });
  } catch (error) {
    console.error("Search trips error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getTripById = async (req, res) => {
  const tripId = parseInt(req.params.id, 10);
  if (isNaN(tripId))
    return res.status(400).json({
      status: "error",
      message: "Invalid trip id",
    });

  try {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        province: true,
        guide: { select: { id: true, name: true } },
      },
    });

    if (!trip) {
      return res.status(404).json({
        status: "error",
        message: "Trip not found",
      });
    }

    res.json({
      status: "success",
      message: "Trip retrieved successfully",
      data: trip,
    });
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.createTrip = async (req, res) => {
  upload.single("picture")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        message: "Upload Picture Failed",
        error: { detail: "Unable to create trip" },
      });
    }

    const { name, provinceId, guideId, price, description } = req.body;
    const picture = req.file ? req.file.filename : null;
    const pId = Number(provinceId);
    const gId = Number(guideId);

    if (isNaN(pId) || isNaN(gId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid provinceId or guideId",
      });
    }

    try {
      const province = await prisma.province.findUnique({
        where: { id: pId },
      });

      if (!province) {
        return res.status(404).json({
          status: "error",
          message: "Province not found",
        });
      }

      const guide = await prisma.guide.findUnique({
        where: { id: gId },
      });

      if (!guide || guide.role !== "GUIDE") {
        return res.status(404).json({
          status: "error",
          message: "Guide not found",
        });
      }

      const trip = await prisma.trip.create({
        data: {
          name,
          provinceId: pId,
          guideId: gId,
          price: price ? Number(price) : null,
          picture,
          description: description || null,
        },
        include: {
          guide: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.status(201).json({
        status: "success",
        message: "Trip created successfully",
        data: trip,
      });
    } catch (error) {
      console.error("Error creating trip:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  });
};

exports.updateTrip = async (req, res) => {
  upload.single("picture")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        message: "Update Picture Failed",
        error: { detail: err.message },
      });
    }

    const tripId = Number(req.params.id);
    if (!tripId) {
      return res.status(400).json({
        status: "error",
        message: "Invalid trip id",
      });
    }

    try {
      const existingTrip = await prisma.trip.findUnique({
        where: { id: tripId },
      });

      if (!existingTrip) {
        return res.status(404).json({
          status: "error",
          message: "Trip not found",
        });
      }

      const {
        name,
        isActive,
        guideId,
        provinceId,
        price,
        description,
      } = req.body;

      let pictureName = existingTrip.picture;
      if (req.file) {
        pictureName = req.file.filename;
      }

      let parsedPrice;
      if (price !== undefined) {
        parsedPrice = Number(price);
        if (isNaN(parsedPrice)) {
          return res.status(400).json({
            status: "error",
            message: "Invalid price",
          });
        }
      }

      const updateData = {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive: isActive === "true" || isActive === true }),
        ...(price !== undefined && { price: parsedPrice }),
        ...(guideId !== undefined && { guideId: Number(guideId) }),
        ...(provinceId !== undefined && { provinceId: Number(provinceId) }),
        picture: pictureName,
      };

      const trip = await prisma.trip.update({
        where: { id: tripId },
        data: updateData,
        include: {
          guide: {
            select: { id: true, name: true },
          },
        },
      });

      res.json({
        status: "success",
        message: "Trip updated successfully",
        data: trip,
      });
    } catch (error) {
      console.error("Error updating trip:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  });
};



exports.deleteTrip = async (req, res) => {
  const tripId = parseInt(req.params.id, 10);

  if (isNaN(tripId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid trip id",
    });
  }

  try {
    await prisma.booking.deleteMany({
      where: { tripId: tripId },
    });

    await prisma.trip.delete({
      where: { id: tripId },
    });

    res.json({
      status: "success",
      message: "Trip deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting trip:", error);

    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};


exports.getTopTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      take: 6,
      orderBy: {
        bookings: {
          _count: "desc",
        },
      },
      include: {
        province: true,
        guide: true,
        _count: {
          select: { bookings: true },
        },
      },
    });

    res.json({
      status: "success",
      message: "Top trips fetched successfully",
      data: trips,
    });

  } catch (error) {
    console.error("Error fetching top trips:", error);

    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};