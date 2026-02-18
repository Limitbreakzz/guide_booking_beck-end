const express = require('express');
const app = express.Router();
const controller = require('../controllers/trip.controller');
const authMiddleware = require('../middlewares/auth.middleware');

app.get('/',
    // #swagger.tags = ['Trips']
    // #swagger.description = 'ดึงข้อมูลทริปทั้งหมด'
    controller.getTrips
);

app.get('/top',
    // #swagger.tags = ['Trips']
    // #swagger.description = 'แสดงทริปยอดนิยม'
    controller.getTopTrips
);

app.get("/q/:keyword",
    // #swagger.tags = ['Trips']
    // #swagger.description = 'ค้นหาทริป'
    controller.getTripsByQuery
);

app.get('/:id',
    // #swagger.tags = ['Trips']
    // #swagger.description = 'ดึงข้อมูลทริปตาม ID'
    controller.getTripById
);

app.post('/',
    // #swagger.tags = ['Trips']
    // #swagger.description = 'เพิ่มข้อมูลทริปใหม่'
    // #swagger.consumes = ['multipart/form-data']
    // #swagger.parameters['name'] = { in: 'formData', type: 'string', required: true }
    // #swagger.parameters['provinceId'] = { in: 'formData', type: 'integer', required: true }
    // #swagger.parameters['guideId'] = { in: 'formData', type: 'integer', required: true }
    // #swagger.parameters['price'] = { in: 'formData', type: 'number' }
    // #swagger.parameters['description'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['isActive'] = { in: 'formData', type: 'boolean' }
    // #swagger.parameters['picture'] = { in: 'formData', type: 'file' }
    authMiddleware.authenticate,
    controller.createTrip
);

app.put('/:id',
    // #swagger.tags = ['Trips']
    // #swagger.description = 'แก้ไขข้อมูลทริป'
    // #swagger.consumes = ['multipart/form-data']
    // #swagger.parameters['name'] = { in: 'formData', type: 'string', required: true }
    // #swagger.parameters['provinceId'] = { in: 'formData', type: 'integer', required: true }
    // #swagger.parameters['guideId'] = { in: 'formData', type: 'integer', required: true }
    // #swagger.parameters['price'] = { in: 'formData', type: 'number' }
    // #swagger.parameters['description'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['isActive'] = { in: 'formData', type: 'boolean' }
    // #swagger.parameters['picture'] = { in: 'formData', type: 'file' }
    authMiddleware.authenticate,
    controller.updateTrip
);

app.delete('/:id',
    // #swagger.tags = ['Trips']
    // #swagger.description = 'ลบข้อมูลทริป'
    authMiddleware.authenticate,
    controller.deleteTrip
);

module.exports = app;
