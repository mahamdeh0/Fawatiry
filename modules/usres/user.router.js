const auth = require('../../middlewear/auth');
const {signup ,signin,addProduct,addProductsArray ,extractContainers} = require('./controller/user.controller');
const router = require('express').Router();
const { myMulter, HME } = require('../../middlewear/myMulter');

router.post('/signUp',signup);
router.post('/signin',signin);
router.post('/AddProducts',auth(),addProduct);
router.post('/AddProductsArray',auth(),addProductsArray);
router.post('/upload-excel', myMulter(['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']).single('file'), HME, extractContainers);

module.exports = router;