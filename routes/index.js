var express = require('express');
var router = express.Router();
const user = require("../controller/userController"); 
const index = require("../controller/indexController");

// send file

router.get('/file/js/:filename',index.filehandler)
/* GET home page. */
router.get('/',user.verifyUser, index.home);
//login
router.get('/login',user.user_login_page);

router.post('/login',user.user_login);
// sign Up
router.get('/signup',user.user_signup_page);

router.post('/signup',user.user_sign_up)

module.exports = router;
