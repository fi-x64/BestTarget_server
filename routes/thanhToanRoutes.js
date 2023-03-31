const express = require('express');
const thanhToanController = require('../controllers/thanhToanController');

const router = express.Router();

router
    .route('/thanhToanMomo')
    .get(thanhToanController.thanhToanMomo);

router
    .route('/thanhToanVNPay')
    .post(thanhToanController.thanhToanVNPay);

router
    .route('/saveMomoPayment')
    .post(thanhToanController.saveMomoPayment);

module.exports = router;
