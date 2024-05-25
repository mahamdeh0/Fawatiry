const auth = require('../../middlewear/auth');
const {signup ,signin,addProduct} = require('./controller/user.controller');
const router = require('express').Router();

router.post('/signUp',signup);
router.post('/signin',signin);
router.post('/AddProducts',auth(),addProduct);

module.exports = router;