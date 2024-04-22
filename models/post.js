const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title:{type:String,required:true},
    content:[{type:String,required:true}],
    time:{type:Date},
    status:{type:String,
        required:true,
        enum:[published,unpublished],
        default:"unpublished",
    }
})

module.exports = mongoose.model("Post", PostSchema);