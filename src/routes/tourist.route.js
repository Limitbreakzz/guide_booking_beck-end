const express = require('express');
const app = express.Router();
const controller = require('../controllers/tourist.controller');
const authMiddleware = require('../middlewares/auth.middleware');

app.get('/',
    // #swagger.tags = ['Tourists']
    // #swagger.description = 'ดึงข้อมูลนักท่องเที่ยวทั้งหมด'
    controller.getTourists
);

app.get('/:id',
    // #swagger.tags = ['Tourists']
    // #swagger.description = 'ดึงข้อมูลนักท่องเที่ยวตาม ID'
    controller.getTouristById
);

app.post('/',
    // #swagger.tags = ['Tourists']
    // #swagger.description = 'เพิ่มข้อมูลนักท่องเที่ยวใหม่'
    // #swagger.consumes = ['multipart/form-data']
    // #swagger.parameters['name'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['email'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['password'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['tel'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['picture'] = { in: 'formData', type: 'file' }
    controller.createTourist
);

app.put('/:id',
    // #swagger.tags = ['Tourists']
    // #swagger.description = 'แก้ไขข้อมูลนักท่องเที่ยว'
    // #swagger.consumes = ['multipart/form-data']
    // #swagger.parameters['name'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['email'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['password'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['tel'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['picture'] = { in: 'formData', type: 'file' }
    authMiddleware.authenticate,
    controller.updateTourist
);

app.delete('/:id',
    // #swagger.tags = ['Tourists']
    // #swagger.description = 'ลบข้อมูลนักท่องเที่ยว'
    authMiddleware.authenticate,
    controller.deleteTourist
);

module.exports = app;
