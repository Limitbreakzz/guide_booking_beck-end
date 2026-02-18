const express = require('express');
const app = express.Router();
const adminController = require('../controllers/admin.controller');

app.get('/dashboard',
    // #swagger.tags = ['auth']
    // #swagger.description = 'แดชบอร์ด'
    adminController.getDashboard);

module.exports = app;
