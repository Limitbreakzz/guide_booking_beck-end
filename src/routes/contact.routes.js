const express = require("express");
const app = express.Router();
const contactController = require('../controllers/contact.controller');
const authMiddleware = require('../middlewares/auth.middleware');

app.post("/",
    // #swagger.tags = ['Contact']
    // #swagger.description = 'แสดงข้อมูลที่ผู้ใช้ส่งเข้ามา'
    authMiddleware.authenticate,
    contactController.sendContact
);

module.exports = app;
