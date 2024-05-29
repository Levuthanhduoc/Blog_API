const asyncHandler = require('express-async-handler')

exports.handler = asyncHandler(async(req,res,next)=>{
    res.cookie("auth","oooooooo",{expires: new Date(Date.now())})
    res.render("jwt_error")
})