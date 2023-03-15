const express = require('express');
const danhMucController = require('../controllers/danhMucController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
    .route('/getAllDanhMuc')
    .get(danhMucController.getAllDanhMuc);

router
    .route('/getAllDanhMucPhu')
    .get(danhMucController.getAllDanhMucPhu);

module.exports = router;
