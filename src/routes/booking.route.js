const express = require('express');
const app = express.Router();
const controller = require('../controllers/booking.controller');
const authMiddleware = require('../middlewares/auth.middleware');

app.get('/',
    // #swagger.tags = ['Bookings']
    // #swagger.description = 'ดึงรายการจองทั้งหมด'
    authMiddleware.authenticate,
    controller.getBookings
);

app.get("/my-bookings",
    // #swagger.tags = ['Bookings']
    // #swagger.description = 'ดึงรายการจองเฉพาะของ role นั้น'
    authMiddleware.authenticate,
    controller.getMyBookings
);

app.get('/:id',
    // #swagger.tags = ['Bookings']
    // #swagger.description = 'ดึงข้อมูลการจองตาม ID'
    authMiddleware.authenticate,
    controller.getBookingById
);

app.post('/',
    // #swagger.tags = ['Bookings']
    // #swagger.description = 'สร้างรายการจองใหม่'
    authMiddleware.authenticate,
    controller.createBooking
);

app.put('/:id',
    // #swagger.tags = ['Bookings']
    // #swagger.description = 'แก้ไขข้อมูลการจอง'
    authMiddleware.authenticate,
    controller.updateBooking
);

app.delete('/:id',
    // #swagger.tags = ['Bookings']
    // #swagger.description = 'ลบข้อมูลการจอง'
    authMiddleware.authenticate,
    controller.deleteBooking
);

module.exports = app;
