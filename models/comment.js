const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    time:{type:Date},
    user:{type:Schema.Types.ObjectId,ref:"user"},
    post:{type:Schema.Types.ObjectId,ref:"Post"},
    content:{type:String,maxLength:2000},
})

module.exports = mongoose.model("Comment",CommentSchema);