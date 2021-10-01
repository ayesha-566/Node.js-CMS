const mongoose=require("mongoose");
const schema=mongoose.Schema;
const URLSlugs=require("mongoose-url-slugs");
const postSchema=new schema({
    user:{
        type:schema.Types.ObjectId,
        ref:"User"
    }
,
    title:{
        type: String,
        required: true,
        unique:true

    },
    status:{
        type: String,
        default: "Public",
        
    },
    allowComments:{
        type: Boolean,
        required: true,
    },
    body:{
        type:String,
        require: true
    },
    file:{
        type:String,
       
    },
    date:{
        type: Date,
        default: Date.now()
    },
    category:{
        //to include an object of user defined type
        type:schema.Types.ObjectId,
        ref:"Category"
    },
    slug:{
        type: String,

    },
    comments:[{ //array of comments
        type:schema.Types.ObjectId,
        ref:"Comment"
    }

    ]


});
//postSchema.plugin(URLSlugs,"title",{field:"slug"});
module.exports=mongoose.model("Post",postSchema);
