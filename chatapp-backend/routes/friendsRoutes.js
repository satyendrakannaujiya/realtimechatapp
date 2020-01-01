const express = require('express');
const router = express.Router();

const authHelper = require('../Helpers/AuthHelper');
const friendCtrl = require('../controllers/friends');

router.post('/follow-user',authHelper.VerifyToken,friendCtrl.followUser);
router.post('/unfollow-user',authHelper.VerifyToken,friendCtrl.unFollowUser);
router.post('/mark/:id',authHelper.VerifyToken,friendCtrl.markNotification);


module.exports = router;