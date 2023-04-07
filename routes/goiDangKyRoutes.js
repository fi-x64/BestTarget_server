const express = require('express');
const goiDangKyController = require('../controllers/goiDangKyController');

const router = express.Router();

router
    .route('/getAllGoiDangKy')
    .get(goiDangKyController.getAllGoiDangKy);

router
    .route('/getOneGoiDangKy')
    .get(goiDangKyController.getOneGoiDangKy);

module.exports = router;
