const express = require('express');
const tinDangController = require('../controllers/tinDangController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
    .route('/createPost')
    .post(tinDangController.createTinDang);

router
    .route('/getGoiY')
    .get(tinDangController.getGoiY);

module.exports = router;