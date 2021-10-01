const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const commentSchema=new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    body:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }
});

module.exports=mongoose.model("Comment",commentSchema);