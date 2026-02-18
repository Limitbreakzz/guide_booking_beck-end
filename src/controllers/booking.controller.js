const prisma = require("../prisma.js");

exports.getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        trip: true,
        province: true,
        tourist: {
          select: { id: true, name: true, tel: true },
        },
        guide: {
          select: {
            id: true,
            name: true,
            experience: true,
            language: true,
            tel: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      status: "success",
      message: "Bookings retrieved successfully",
      data: bookings,
    });

  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const user = req.user;
    let where = {};

    if (user.role === "GUIDE") {
      where.guideId = user.id;
    }

    if (user.role === "TOURIST") {
      where.touristId = user.id;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        trip: true,
        province: true,
        tourist: {
          select: { id: true, name: true, tel: true },
        },
        guide: {
          select: {
            id: true,
            name: true,
            experience: true,
            language: true,
            tel: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      status: "success",
      message: "Bookings retrieved successfully",
      data: bookings,
    });

  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getBookingById = async (req, res) => {
  const bookingId = parseInt(req.params.id, 10);
  if (isNaN(bookingId))
    return res.status(400).json({
      status: "error",
      message: "Invalid booking id",
    });

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        trip: true,
        province: true,
        tourist: { select: { id: true, name: true } },
        guide: { select: { id: true, name: true } },
      },
    });

    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found",
      });
    }

    res.json({
      status: "success",
      message: "Booking retrieved successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { tripId, datetime } = req.body;

    const tId = Number(tripId);
    const bookingDate = new Date(datetime);

    const tUserId = Number(req.user.id);

    if (isNaN(tId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid tripId",
      });
    }

    if (isNaN(tUserId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid touristId",
      });
    }

    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        status: "error",
        message: "Invalid datetime",
      });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tId },
    });

    if (!trip) {
      return res.status(404).json({
        status: "error",
        message: "Trip not found",
      });
    }

    const booking = await prisma.booking.create({
      data: {
        tripId: trip.id,
        touristId: tUserId,
        guideId: trip.guideId,
        provinceId: trip.provinceId,
        datetime: bookingDate,
        status: "pending",
      },
      include: {
        tourist: true,
        guide: true,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.updateBooking = async (req, res) => {
  const bookingId = parseInt(req.params.id, 10);
  if (isNaN(bookingId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid booking id",
    });
  }

  const { datetime, status } = req.body;
  const userId = req.user.id;
  const role = req.user.role;

  try {
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!existingBooking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found",
      });
    }

    if (status !== undefined) {
      if (role !== "GUIDE" || existingBooking.guideId !== userId) {
        return res.status(403).json({
          status: "error",
          message: "You are not allowed to update this booking",
        });
      }

      const allowedStatus = ["pending", "confirmed", "rejected", "cancelled"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid status value",
        });
      }
    }

    let parsedDate;
    if (datetime !== undefined) {
      parsedDate = new Date(datetime);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          status: "error",
          message: "Invalid datetime format",
        });
      }
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        ...(datetime !== undefined ? { datetime: parsedDate } : {}),
        ...(status !== undefined ? { status } : {}),
      },
      include: {
        tourist: true,
        guide: true,
        trip: true,
      },
    });

    res.json({
      status: "success",
      message: "Booking updated successfully",
      data: updatedBooking,
    });

  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};


exports.deleteBooking = async (req, res) => {
  const bookingId = parseInt(req.params.id, 10);
  if (isNaN(bookingId))
    return res.status(400).json({
      status: "error",
      message: "Invalid booking id",
    });

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found",
      });
    }

    await prisma.booking.delete({
      where: { id: booking.id },
    });

    res.json({
      status: "success",
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
