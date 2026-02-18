const prisma = require("../prisma");

exports.getDashboard = async (req, res) => {
  try {
    const totalTrips = await prisma.trip.count();
    const totalGuides = await prisma.guide.count();
    const totalTourists = await prisma.tourist.count();
    const totalBookings = await prisma.booking.count();

    res.json({
      totalTrips,
      totalGuides,
      totalTourists,
      totalBookings,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard error" });
  }
};
