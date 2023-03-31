const express = require('express');
const menhGiaController = require('../controllers/menhGiaController');

const router = express.Router();

router
    .route('/getAllMenhGia')
    .get(menhGiaController.getAllMenhGia);

router
    .route('/getOneMenhGia')
    .get(menhGiaController.getOneMenhGia);

module.exports = router;
