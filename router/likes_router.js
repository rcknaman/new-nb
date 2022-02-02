const express = require('express');
const router = express.Router();
const likes_controller = require('../controller/Likes_controller');
router.get('/toggle', likes_controller.toggleLike);

module.exports = router;