const express=require("express");
const app=express();
const router=express.Router();
const exphbs = require("express-handlebars");
app.engine("handlebars",exphbs({defaultLayout:"admin"}));
app.set("view engine","handlebars");
const Category=require("../../models/Category");
const {userAuthenticated}=require("../../helpers/authentication");

//router.all("/*",(req,res,next)=>{
//    req.app.locals.defaultLayout="admin";
//})
router.get("/",userAuthenticated,(req,res,next)=>{
    Category.find({}).then(categories=>{
        res.render("admin/categories/index",{categories:categories});
    })
   
 
});
router.post("/create",userAuthenticated,(req,res,next)=>{
    const category=new Category({
        name:req.body.name,
        date:Date.now()
    });
    category.save().then(saved=>{
        Category.find({}).then(categories=>{
            res.render("admin/categories/index",{categories:categories});
        })
        
    })

  
 });
 
////For updating, 2 routes are required. First route is get: to display the edit page
//Second is the put route to actually update 
 router.get("/edit/:name",userAuthenticated,(req,res,next)=>{
    Category.findOne({name:req.params.name}).then(category=>{
        res.render("admin/categories/edit",{category:category});
    });
 
});

router.put("/edit/:name",userAuthenticated,(req,res,next)=>{
    Category.findOne({name:req.params.name}).then(category=>{
        category.name=req.body.name;
        category.save().then(savedCategory=>{
            res.redirect("/admin/categories");
        })
     
    });
 
});
//////////////
///Delete
router.delete("/delete/:name",userAuthenticated,(req,res,next)=>{
    Category.remove({name:req.params.name}).then(category=>{
        res.redirect("/admin/categories");
    })
});

module.exports=router;