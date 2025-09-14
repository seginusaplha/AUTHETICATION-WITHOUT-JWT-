const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const validation = require('../middleware/validation');


router.get('/search', validation.imageSearch, imageController.searchImages);
router.post('/profile', imageController.setProfileImage);
router.get('/:id', imageController.getImageById);

module.exports = router;
