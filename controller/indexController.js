const asyncHandler = require('express-async-handler')
const path = require('path')
exports.home = asyncHandler(async(req,res,next)=>{
    res.render("index",{user:req.userToken})
})

exports.filehandler = asyncHandler(async(req,res,next)=>{
    res.sendFile(req.params.filename,{root:path.join(__dirname,'../public/javascripts/')}, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log(`Sent:${req.params.filename}`);
        }
    });
})