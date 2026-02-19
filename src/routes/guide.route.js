const express = require('express');
const app = express.Router();
const controller = require('../controllers/guide.controller');
const authMiddleware = require('../middlewares/auth.middleware');

app.get('/',
    // #swagger.tags = ['Guides']
    // #swagger.description = 'ดึงข้อมูลไกด์ทั้งหมด'
    controller.getGuides
);

app.get("/guides/top",
    // #swagger.tags = ['Guides']
    // #swagger.description = 'แสดงไกด์ยอดนิยม'
    controller.getTopGuides
);

app.get("/q/:keyword",
    // #swagger.tags = ['Guides']
    // #swagger.description = 'ค้นหาไกด์'
    controller.getGuideByQuery
);

app.get('/:id',
    // #swagger.tags = ['Guides']
    // #swagger.description = 'ดึงข้อมูลไกด์ตาม ID'
    controller.getGuideById
);

app.post('/',
    // #swagger.tags = ['Guides']
    // #swagger.description = 'เพิ่มข้อมูลไกด์ใหม่'
    // #swagger.consumes = ['multipart/form-data']
    // #swagger.parameters['name'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['email'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['password'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['tel'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['experience'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['language'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['status'] = { in: 'formData', type: 'Boolean' }
    // #swagger.parameters['picture'] = { in: 'formData', type: 'file' }
    controller.createGuide
);

app.put('/:id',
    // #swagger.tags = ['Guides']
    // #swagger.description = 'แก้ไขข้อมูลไกด์'
    // #swagger.consumes = ['multipart/form-data']
    // #swagger.parameters['name'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['email'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['password'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['tel'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['experience'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['language'] = { in: 'formData', type: 'string' }
    // #swagger.parameters['status'] = { in: 'formData', type: 'Boolean' }
    // #swagger.parameters['picture'] = { in: 'formData', type: 'file' }
    authMiddleware.authenticate,
    controller.updateGuide
);

app.delete('/:id',
    // #swagger.tags = ['Guides']
    // #swagger.description = 'ลบข้อมูลไกด์'
    authMiddleware.authenticate,
    controller.deleteGuide
);

module.exports = app;
