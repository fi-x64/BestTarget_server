const express = require('express');
const luotXemTinController = require('../controllers/luotXemTinController');
const authController = require('../controllers/authController');

const router = express.Router();

router
    .route('/getLuotXemTinByTinDangId')
    .get(luotXemTinController.getLuotXemTinByTinDangId);

router
    .route('/statisticsLuotXemTinByCategory')
    .post(luotXemTinController.statisticsLuotXemTinByCategory);

router
    .route('/statisticsLuotXemTinInWeek')
    .get(luotXemTinController.statisticsLuotXemTinInWeek);

router
    .route('/getAllTinDangRelatedHot')
    .post(luotXemTinController.getAllTinDangRelatedHot);

router.use(authController.protect);

router
    .route('/createLuotXemTin')
    .post(luotXemTinController.createLuotXemTin);

router
    .route('/deleteAllLuotXemTin')
    .delete(luotXemTinController.deleteAllLuotXemTin);

module.exports = router;
