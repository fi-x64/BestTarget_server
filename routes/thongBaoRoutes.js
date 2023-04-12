const express = require('express');
const thongBaoController = require('../controllers/thongBaoController');

const router = express.Router();

router
    .route('/getAllThongBao')
    .get(thongBaoController.getAllThongBao);

router
    .route('/createThongBao')
    .post(thongBaoController.createThongBao);

router
    .route('/createAllThongBao')
    .post(thongBaoController.createAllThongBao);

router
    .route('/editReadThongBao')
    .get(thongBaoController.editReadThongBao);

module.exports = router;