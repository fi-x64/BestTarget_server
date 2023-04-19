const express = require('express');
const authController = require('../controllers/authController');
const phongChatController = require('../controllers/phongChatController');

const router = express.Router();

router
    .route('/getAllPhongChat')
    .get(phongChatController.getAllPhongChat);


router
    .route('/getOnePhongChat')
    .get(phongChatController.getOnePhongChat);


router.use(authController.protect);

router
    .route('/getAllPhongChatByUserId')
    .get(phongChatController.getAllPhongChatByUserId);

router
    .route('/getAllPhongChatForNoti')
    .get(phongChatController.getAllPhongChatForNoti);

router
    .route('/createPhongChat')
    .post(phongChatController.createPhongChat);

module.exports = router;
