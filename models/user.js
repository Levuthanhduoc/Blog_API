const mongoose = require('mongoose');
const Schema =mongoose.Schema;

const UserSchema = new Schema({
    role:{type:String,required:true,enum:["user","admin"]},default:"user",
    username:{type:String,required:true,index:{unique:true}},
    password:{required:true,type:String},
    salt:{required:true,type:String},
})

module.exports = mongoose.model("User",UserSchema);