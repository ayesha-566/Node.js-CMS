const express=require("express");
const app=express();
const router=express.Router();
const exphbs = require("express-handlebars");
app.engine("handlebars",exphbs({defaultLayout:"admin"}));
app.set("view engine","handlebars");
const {isEmpty}=require("../../helpers/upload-helper");
//to delete files(images)
const fs=require("fs");
const path=require("path");
const {userAuthenticated}=require("../../helpers/authentication")

const Post=require("../../models/Post"); //get Post schema from models
const Category = require("../../models/Category");
//router.all("/*",userAuthenticated,(req,res,next)=>{
//    req.app.locals.defaultLayout="admin";
//})
router.get("/",userAuthenticated,(req,res,next)=>{
    //use find().lean().then OR
    //npm install @handlebars/allow-prototype-access video 93 8.00 min
    Post.find({}).populate("category").then(posts=>{

        res.render("admin/posts/show",{posts:posts});  //when we pass nothing here, it returns everything and here we need all the posts
        //populate("category"): this function passes the object category instead of just the id of category
        //once you get the object, you can easily access its attributes
        
    }); 
 
});

////////////////////////////////////////////////////////////////////////
router.get("/create",userAuthenticated,(req,res,next)=>{
    Category.find({}).then(categories=>{
        res.render("admin/posts/create",{categories:categories});
    });
    
});
router.post("/create",userAuthenticated,(req,res,next)=>{
//allowComments is a checkbox field and it returns a string but in our database we have defined it to be a boolean.
//So here we define a variable com which has default value true, then compare it to request data and change/not change value accordingly


 //   if(!isEmpty(req.files)){
 //       let file=req.files.file;  //get the file from form
 //       let filename=Date.now()+"-"+file.name;  //acces the name of file and assign it to filename
 //       file.mv("./public/uploads/"+filename,(error)=>{ //save the file in public/uploads folder
 //           if(error){
 //               throw error;
 //           }
 //      });
  //   console.log("Not empty");
 //   }
  let errors=[];
  if(!req.body.title){
      errors.push({message:"Please add a title"});
     
  }
  if(!req.body.status){
    errors.push({message:"Please select a status"});
}
 if(!req.body.body){
    errors.push({message:"Please enter description"});
}
if(!req.files.file){
    errors.push({message:"Please enter a file"});
}

if(errors.length>0){
  
    res.render("admin/posts/create",{errors:errors});
}
 let file=req.files.file;  //get the file from form
       let filename=Date.now()+"-"+file.name;  //acces the name of file and assign it to filename
        file.mv("./public/uploads/"+filename,(error)=>{ //save the file in public/uploads folder
            if(error){
                throw error;
            }
       });

    let com=true;
    if(req.body.allowComments){
        com=true;
    }
    else{
        com=false;
    }
   const post=new Post({ /// attribute "name" used in html file is used to get data from html file. The file connected here is create.handlebars in views/admin/posts
        title: req.body.title,
        status: req.body.status,
        allowComments: com,
        body: req.body.body,
        file: filename,
        category:req.body.category,
        user:req.user.id
    });
    post.save().then(savedPost=>{
        //console.log(savedPost);
        req.flash("success_message","Post was created successfully"); //using flash module
        res.redirect("/admin/posts")  //redirect it to somewhere after saving
    }).catch(error=>{
       // console.log(error);
        res.redirect("/admin/posts");
    });
});
//////////////////////////////////////////////////////////////////////
//UPDATING
router.get("/edit/:title",userAuthenticated,(req,res,next)=>{
    Post.findOne({title:req.params.title}).then(post=>{
        Category.find({}).then(categories=>{
            res.render("admin/posts/edit",{post:post,categories:categories});
        })
        
    });
  
});
router.put("/edit/:title",userAuthenticated,(req,res,next)=>{
    let title=req.params.title;
    Post.findOne({title:title}).then(post=>{
        let com=true;
    if(req.body.allowComments){
        com=true;
    }
    else{
        com=false;
    }
        post.user=req.user.id; //the person who is logged in creates a post 
        post.title=req.body.title;
        post.allowComments=com;
        post.body=req.body.body;
        post.status=req.body.status;
        post.category=req.body.category
        let file=req.files.file;
        let filename=Date.now()+"-"+file.name;
        post.file=filename;
        file.mv("./public/uploads/"+filename,(error)=>{
            if(error) throw error;
        });
        post.save().then(updatedPost=>{
            //post updated so redirect to all posts showing page
            req.flash("success_message","Post was edited successfully"); //using flash module
            res.redirect("/admin/posts/my-posts");
        });
    });
});
///////////////////////////
////DELETING
router.delete("/:title",userAuthenticated,(req,res,next)=>{
    Post.findOne({title:req.params.title}).populate("comments").then(post=>{
        fs.unlink("./public/uploads/"+post.file,(error)=>{//to delete file
            //To delete comments when a post is deleted
            if(!post.comments.length<1){ //comments are empty: no comments 
                post.comments.forEach(comment=>{
                    comment.remove();
                })
            }
            post.remove();
            if(error){
                console.log(error);

            }
            else{
                req.flash("success_message","Post was deleted successfully"); //using flash module
                res.redirect("/admin/posts/my-posts");
            }

        })
      //  res.redirect("/admin/posts");
    });
});

///////////
router.get("/my-posts",(req,res)=>{
    Post.find({user:req.user._id}).populate("category").then(posts=>{
        res.render("admin/posts/my-posts",{posts:posts});
    })
})
////////////

module.exports=router;