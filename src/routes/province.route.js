const express = require('express');
const app = express.Router();
const controller = require('../controllers/province.controller');
const authMiddleware = require('../middlewares/auth.middleware');

app.get('/',
    // #swagger.tags = ['Provinces']
    // #swagger.description = 'ดึงข้อมูลจังหวัดทั้งหมด'
    controller.getProvinces
);

app.get('/:id',
    // #swagger.tags = ['Provinces']
    // #swagger.description = 'ดึงข้อมูลจังหวัดตาม ID'
    controller.getProvinceById
);

app.post('/',
    // #swagger.tags = ['Provinces']
    // #swagger.description = 'เพิ่มข้อมูลจังหวัดใหม่'
    authMiddleware.authenticate,
    controller.createProvince
);

app.put('/:id',
    // #swagger.tags = ['Provinces']
    // #swagger.description = 'แก้ไขข้อมูลจังหวัด'
    authMiddleware.authenticate,
    controller.updateProvince
);

app.delete('/:id',
    // #swagger.tags = ['Provinces']
    // #swagger.description = 'ลบข้อมูลจังหวัด'
    authMiddleware.authenticate,
    controller.deleteProvince
);


module.exports = app;
