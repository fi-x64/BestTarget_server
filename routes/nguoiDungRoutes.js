const express = require('express');
const nguoiDungController = require('../controllers/nguoiDungController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/changeAvatar/:id', nguoiDungController.changeAvatar);

router
  .route('/profile')
  .get(nguoiDungController.getUser)

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/me', nguoiDungController.getMe, nguoiDungController.getUser);
router.patch('/updateMyPassword', authController.updatePassword);
router.patch('/updateMe', nguoiDungController.updateMe);
router.delete('/deleteMe', nguoiDungController.deleteMe);

router
  .route('/getAllTinhThanh')
  .get(nguoiDungController.getAllTinhThanh);

router.use(authController.restrictTo('Admin'));

router
  .route('/statisticsUserInWeek')
  .get(nguoiDungController.statisticsUserInWeek)

router
  .route('/search')
  .get(nguoiDungController.searchUser)

router
  .route('/:id')
  .patch(nguoiDungController.updateUser)
  .delete(nguoiDungController.deleteUser);

router
  .route('/')
  .get(nguoiDungController.getAllUsers)
  .post(nguoiDungController.createUser);



module.exports = router;
