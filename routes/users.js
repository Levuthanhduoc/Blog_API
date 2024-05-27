var express = require('express');
var router = express.Router();

const User =require("../controller/userController");
const Post = require('../controller/postController');

router.get("/post/new",Post.new_post_page);
router.post("/post/new",Post.create_post);

router.get("/post/history",Post.history);

router.get("/post/history/:id",Post.detail);

router.get("/post/history/:id/edit",Post.edit_page);
router.post("/post/history/:id/edit",Post.edit);

router.get("/post/history/:id/delete",Post.delete_page);
router.post("/post/history/:id/delete",Post.delete);

module.exports = router;