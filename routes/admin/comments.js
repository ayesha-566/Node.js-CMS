const express=require("express");
const app=express();
const router=express.Router();
const Post=require("../../models/Post");
const User=require("../../models/User");
const Comment=require("../../models/Comment");
const {userAuthenticated}=require("../../helpers/authentication");


//Route to get all comments 
router.get("/",userAuthenticated,(req,res,next)=>{
    let comm=[];
    Comment.find({}).populate("user").then(comments=>{
      render("admin/comments",{comments:comments});
    })
   
})



router.delete("/:id",userAuthenticated,(req,res,next)=>{
    Comment.remove({_id:req.params.id}).then(deleted=>{
        Post.findOneAndUpdate({comments:req.params.id},{$pull:{comments:req.params.id}},useFindAndModify=false,(err,data)=>{
            if(err){
                console.log(err);
            }
            else{
                res.redirect("/admin/comments");
            }
        })
        
      
    })
})



router.post("/:title",userAuthenticated,(req,res,next)=>{
  
    Post.findOne({title:req.params.title}).then(post=>{
        
        comment=new Comment({
            user: req.user.id, //we get this req.user from the session information which is handled by passport
            body: req.body.body
        });
        post.comments.push(comment);
        post.save().then(savedPost=>{
            comment.save().then(saved=>{
             res.redirect("back");
            })
        })
    })
  
})



module.exports=router;

