const express = require('express');
const router = express.Router();

const authHelper = require('../Helpers/AuthHelper');
const userCtrl = require('../controllers/users');

router.get('/users',authHelper.VerifyToken,userCtrl.getAllUsers);
router.get('/user/:id',authHelper.VerifyToken,userCtrl.getUserById);
router.get('/username/:username',authHelper.VerifyToken,userCtrl.getUserByUsername);


module.exports = router;