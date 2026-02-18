const prisma = require("../prisma.js");

exports.getProvinces = async (req, res) => {
  try {
    const provinces = await prisma.province.findMany({
      orderBy: { name: "asc" },
    });

    res.json({
      status: "success",
      message: "Provinces retrieved successfully",
      data: provinces,
    });
  } catch (error) {
    console.error("Error fetching provinces:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getProvinceById = async (req, res) => {
  const provinceId = parseInt(req.params.id, 10);
  if (isNaN(provinceId))
    return res.status(400).json({
      status: "error",
      message: "Invalid province id",
    });

  try {
    const province = await prisma.province.findUnique({
      where: { id: provinceId },
    });

    if (!province) {
      return res.status(404).json({
        status: "error",
        message: "Province not found",
      });
    }

    res.json({
      status: "success",
      message: "Province retrieved successfully",
      data: province,
    });
  } catch (error) {
    console.error("Error fetching province:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.createProvince = async (req, res) => {
  try {
    const { name } = req.body;

    const existing = await prisma.province.findUnique({
      where: { name },
    });

    if (existing) {
      return res.status(400).json({
        status: "error",
        message: "Province already exists",
      });
    }

    const province = await prisma.province.create({
      data: { name },
    });

    res.status(201).json({
      status: "success",
      message: "Province created successfully",
      data: province,
    });
  } catch (error) {
    console.error("Error creating province:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.updateProvince = async (req, res) => {
  const provinceId = parseInt(req.params.id, 10);
  if (isNaN(provinceId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid province id",
    });
  }

  try {
    const { name } = req.body;

    const province = await prisma.province.update({
      where: { id: provinceId },
      data: { name },
    });

    res.json({
      status: "success",
      message: "Province updated successfully",
      data: province,
    });
  } catch (error) {
    console.error("Error updating province:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        status: "error",
        message: "Province not found",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.deleteProvince = async (req, res) => {
  const provinceId = parseInt(req.params.id, 10);
  if (isNaN(provinceId))
    return res.status(400).json({
      status: 'error',
      message: 'Invalid province id'
    });

  try {
    await prisma.province.delete({
      where: { id: provinceId },
    });

    res.json({
      status: "success",
      message: "Province deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting province:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        status: "error",
        message: "Province not found",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};


