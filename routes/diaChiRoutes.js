const express = require('express');
const diaChiController = require('../controllers/diaChiController');

const router = express.Router();

router
    .route('/getAllTinhThanh')
    .get(diaChiController.getAllTinhThanh);

router
    .route('/getQuanHuyen')
    .get(diaChiController.getQuanHuyen);

router
    .route('/getPhuongXa')
    .get(diaChiController.getPhuongXa);

router
    .route('/getOneTinhTP')
    .get(diaChiController.getOneTinhTP);

router
    .route('/getOneQuanHuyen')
    .get(diaChiController.getOneQuanHuyen);

router
    .route('/getOnePhuongXa')
    .get(diaChiController.getOnePhuongXa);

router
    .route('/getOneDiaChi')
    .get(diaChiController.getOneDiaChi);

module.exports = router;