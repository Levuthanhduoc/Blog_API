const mongoose = require('mongoose');
const Schema =mongoose.Schema;

const UserSchema = new Schema({
    name:{type:String,required:true,maxLength:1000},
    username:{type:String,required:true,index:{unique:true}},
    password:{required:true,type:String},
})

module.exports = mongoose.model("User",UserSchema);