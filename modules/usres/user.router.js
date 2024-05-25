const auth = require('../../middlewear/auth');
const {signup ,signin,addProduct,addProductsArray ,extractContainers} = require('./controller/user.controller');
const router = require('express').Router();
const { myMulter, HME } = require('../../services/multer');

router.post('/signUp',signup);
router.post('/signin',signin);
router.post('/AddProducts',auth(),addProduct);
router.post('/AddProductsArray',auth(),addProductsArray);
router.post('/upload', myMulter(['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']), HME, extractContainers);

module.exports = router;  