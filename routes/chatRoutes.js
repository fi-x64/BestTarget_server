const express = require('express');
const authController = require('../controllers/authController');
const chatController = require('../controllers/chatController');

const router = express.Router();

router
    .route('/getAllChat')
    .get(chatController.getAllChat);

router
    .route('/getAllChatByPhongId')
    .get(chatController.getAllChatByPhongId);

router
    .route('/getOneChat')
    .get(chatController.getOneChat);

router.use(authController.protect);

router
    .route('/createChat')
    .post(chatController.createChat);

router
    .route('/editReadChat')
    .get(chatController.editReadChat);

module.exports = router;
