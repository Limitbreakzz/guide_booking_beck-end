const express = require('express');
const app = express.Router();
const controller = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

app.post('/login',
    // #swagger.tags = ['auth']
    // #swagger.description = 'ล็อคอิน'
    controller.login
);

app.post('/register',
    // #swagger.tags = ['auth']
    // #swagger.description = 'สมัครสมาชิก'
    controller.register
);

module.exports = app;
