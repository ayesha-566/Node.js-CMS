const mongoose=require("mongoose");
const schema=mongoose.Schema;

const categorySchema=new schema({

    name:{
        type: String,
        required: true,
        unique:true

    },
    date:{
        type: Date,
        default: Date.now()
    }
});

module.exports=mongoose.model("Category",categorySchema);