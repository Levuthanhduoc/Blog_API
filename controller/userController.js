const asyncHandler = require('express-async-handler')
const{body,validationResult, Result}= require('express-validator');
require('dotenv').config();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const key = fs.readFileSync('jwtRS256.key');;
const saltRounds = 10;


exports.verifyUser = asyncHandler(async(req,res,next)=>{
    const token = req.cookies["auth"];
    if(token !== undefined){
        await jwt.verify(token,key,(err,data)=>{
            if(err){
                console.log(err.message);
            }else{
                req.userToken = data;
            }
        }); 
    }
    next()
})

exports.user_signup_page = asyncHandler(async (req,res,next)=>{
    res.render("signup",{title:"SIGN UP"});
})

exports.user_sign_up = [
    body("username","empty username").trim().isLength({min:1}).escape(),
    body("password").trim().matches(/^(?=.*[A-Za-z])(?=.*[\d])[A-Za-z\d]{8,}$/gm)
        .withMessage("password must longer than 7 character, had atleast 1 alphapet and 1 number"),
    body("repassword").trim().custom((value,{req})=>{
        return value === req.body.password;
    }).withMessage("password confirmation not match"),
    asyncHandler(async(req,res,next)=>{
        const errors = validationResult(req);
        if(errors.isEmpty()){
            const user = await User.find({username:req.body.username}).exec();
            if(user.length === 0){
                const salt = await bcrypt.genSalt(saltRounds);
                const encrypt = await bcrypt.hash(req.body.password,salt);
                const newUser = new User( {
                    role:"user",
                    username:req.body.username,
                    password:encrypt,
                    salt:salt,
                })
                await newUser.save();
                res.render("login",{message:"signup successfull please login!"});
            }else{
                errors.errors.push({msg:"username already exist"});
            }
        }
        if(!errors.isEmpty()){
            res.render("signup",{
                errors:errors.errors,
                username:req.body.username,
                password:req.body.password,
                repassword:req.body.repassword,
            })
        }
    })
]

exports.user_login_page = asyncHandler(async (req,res,next)=>{
    res.render("login",{title:"LOGIN"});
})

exports.user_login=[
    body("username","empty username").trim().isLength({min:1}).escape(),
    body("password").trim().matches(/^(?=.*[A-Za-z])(?=.*[\d])[A-Za-z\d]{8,}$/gm)
        .withMessage("password must longer than 7 character, had atleast 1 alphapet and 1 number"),
    asyncHandler(async(req,res,next)=>{
        const errors = validationResult(req);
        if(errors.isEmpty()){
            const user = await User.find({username:req.body.username}).exec();
            if(user.length === 1){
                const password = await bcrypt.hash(req.body.password,user[0].salt);
                if(password === user[0].password){
                    const token = jwt.sign({
                        id:user[0]._id,
                        username:req.body.username,
                    },key,{ algorithm: 'RS256',expiresIn:"1h" })
                    res.cookie("auth",token,new Date(Date.now() + 60*60*1000));
                    res.redirect("/");
                }
                else{
                    errors.errors.push({msg:"password not match"});
                }
            }else{
                errors.errors.push({msg:"username not exist"});
            }
        }
        if(!errors.isEmpty()){
            res.render("login",{
                errors:errors.errors,
                username:req.body.username,
                password:req.body.password,
            })
        }
    })
]