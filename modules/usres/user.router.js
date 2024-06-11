const auth = require('../../middlewear/auth');
const {signup,signin,getInvoices,createInvoice,storeUnpaidInvoicesForCustomer,addProduct,addProductsArray ,initDataBaseFromHisabatiXlsx,getProducts} = require('./controller/user.controller');
const router = require('express').Router();
const { myMulter, HME } = require('../../services/multer');

router.post('/signUp',signup);
router.post('/signin',signin);
router.post('/AddProducts',auth(),addProduct);
router.post('/AddProductsArray',auth(),addProductsArray);
router.get('/getProducts',auth(),getProducts);
router.post('/upload', auth(),myMulter(['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']), HME, initDataBaseFromHisabatiXlsx);

router.post('/invoice',auth(), createInvoice);
router.get('/getinvoice',auth(), getInvoices);

router.post('/customer/:customerId/storeUnpaidInvoices', auth(), storeUnpaidInvoicesForCustomer);

module.exports = router;  