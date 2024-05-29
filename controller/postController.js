const asyncHandler = require('express-async-handler')
const path = require('path')
const{body,validationResult, Result}= require('express-validator');

const User = require("../models/user");
const Post = require("../models/post");

exports.new_post_page = asyncHandler(async (req,res,next)=>{
    res.render("post_new",{url:"/users/post/new",title:"Create new post",post:{}});
})

exports.create_post =[
    body("content").exists().trim().isLength({min:1}).withMessage("Post must not empty").escape(),
    body("title").exists().trim().isLength({min:1}).withMessage("title must not empty").escape(), 
    asyncHandler(async (req,res,next)=>{
        const err = validationResult(req);
        if(!err.isEmpty()){
            res.render("post_new",{
                title:req.title,
                content:req.content,
            })
            return;
        }
        const user = await User.find({username:req.userToken.username});
        if(user){
            const newPost = new Post({
                title:req.body.title,
                content:req.body.content,
                time: Date.now(),
                status:req.body.status,
                author:user[0]._id,
            })
            await newPost.save();
            res.redirect(newPost.url);
        }
    }
)]

exports.history = asyncHandler(async (req,res,next)=>{
    console.log(req.query)
    let page = req.query.page?req.query.page:1; //is page exist
    page=Number(page); // change to number
    page=page<1?1:page; //is page negitive
    
    const allPost = await Post.find({},"title time status").limit((page+1)*20).exec();
    res.render("post_history",{list:allPost,page:page+1});
})

exports.detail = asyncHandler(async (req,res,next)=>{
    const id = req.params.id;
    const post = await Post.findById(id).exec();
    if(post){
        res.render("post_detail",{post:post});
    }else{
        res.status(404);
        res.end();
    }
})

exports.delete_page = asyncHandler(async (req,res,next)=>{
    const id = req.params.id;
    const post = await Post.findById(id).exec();
    if(post){
        res.render("post_del",{post:post});
    }else{
        res.status(404);
        res.end();
    }
})

exports.delete = asyncHandler(async (req,res,next)=>{
    const id = req.params.id;
    const user = await Post.findById(id,"author").populate("author");
    if(user.author._id.toString() !== req.userToken.id){
        res.redirect("/error");
        return;
    }
    await Post.findByIdAndDelete(id);
    res.redirect("/users/post/history")
})

exports.edit_page = asyncHandler(async (req,res,next)=>{
    const id = req.params.id;
    const userPost = await Post.findById(id);
    if(userPost){
        res.render("post_new",{
            url:userPost.url + "/edit",
            post:userPost,
            title:"Edit Post",
        })
    }else{
        res.status(404)
        res.end()
    }
})

exports.edit = [
    body("content").exists().trim().isLength({min:1}).withMessage("Post must not empty").escape(),
    body("title").exists().trim().isLength({min:1}).withMessage("title must not empty").escape(),
    body("status").exists().trim().matches(/\bunpublished\b|\bpublished\b/g).withMessage("status not exist").escape(),
    asyncHandler(async (req,res,next)=>{
        const id = req.params.id;
        const user = await Post.findById(id,"author").populate("author");
        if(user.author._id.toString() !== req.userToken.id){
            res.redirect("/error");
            return;
        }
        const err = validationResult(req);
        if(!err.isEmpty()){
            res.render("post_new",{
                url:req.url,
                post:{
                    title:req.body.title,
                    content:req.body.content,
                    status:req.body.status,
                },
                title:"Edit Post",
            })
            return;
        }
        const edited = new Post({
            title:req.body.title,
            content:req.body.content,
            status:req.body.status,
            time:new Date(Date.now),
            author:req.userToken.id,
            isEdited:true,
            _id: id,
        })
        const editedPost = await Post.findByIdAndUpdate(id,edited);
        res.redirect(editedPost.url);
    })
]