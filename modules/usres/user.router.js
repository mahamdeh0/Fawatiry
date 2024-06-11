const auth = require('../../middlewear/auth');
const {getCustomers,addCustomer,signup,signin,getInvoices,createInvoice,storeUnpaidInvoicesForCustomer,addProduct,addProductsArray ,initDataBaseFromHisabatiXlsx,getProducts} = require('./controller/user.controller');
const router = require('express').Router();
const { myMulter, HME } = require('../../services/multer');

router.post('/signUp',signup);
router.post('/signin',signin);
router.post('/AddProducts',auth(),addProduct);
router.post('/AddProductsArray',auth(),addProductsArray);
router.get('/getProducts',auth(),getProducts);
router.post('/upload', auth(),myMulter(['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']), HME, initDataBaseFromHisabatiXlsx);
router.post('/addCustomers', auth(),addCustomer)
router.post('/invoice',auth(), createInvoice);
router.get('/getinvoice',auth(), getInvoices);
router.get('/getCustomers',auth(), getCustomers);

router.post('/customer/:customerId/storeUnpaidInvoices', auth(), storeUnpaidInvoicesForCustomer);

module.exports = router;  