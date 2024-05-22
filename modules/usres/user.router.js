const {signup ,signin} = require('./controller/user.controller');
const router = require('express').Router();

router.post('/signUp',signup);
router.post('/signin',signin);


module.exports = router;