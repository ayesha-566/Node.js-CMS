const express=require("express");
const app=express();
const router=express.Router();
const path=require("path");
app.use(express.static(path.join(__dirname,"public")));
const handle=require("express-handlebars");
const exphbs = require("express-handlebars");
//npm install express-handlebars
app.engine("handlebars",exphbs({defaultLayout:"home"}));
app.set("view engine","handlebars");
const Post=require("../../models/Post");
const Category=require("../../models/Category");
const User=require("../../models/User");
const bcrypt=require("bcryptjs");
const passport=require("passport");
const {userAuthenticated}=require("../../helpers/authentication");
const localStrategy=require("passport-local").Strategy;

router.get("/",(req,res)=>{
  
    Post.find({}).then(posts=>{
      
            Category.find({}).then(categories=>{
                res.render("home/index",{posts:posts,categories:categories});
            });
           
        
      
    });
    
});
router.get("/about",(req,res)=>{
    res.render("home/about");
});
/////////////////
////2 routes required for login
///Code for passport login in passport.txt file
router.get("/login",(req,res)=>{
    res.render("home/login");
});
router.post("/login",(req,res,next)=>{
    passport.authenticate("local",{
        successRedirect:"/admin",
        failureRedirect:"/login",
        failureFlash: true
    })(req,res,next);
})
passport.use(new localStrategy({usernameField:"email"},(email,password,done)=>{
    User.findOne({email:email}).then(user=>{
        if(!user){
            return done(null,false,{message:"Incorrect email"});
        }
        bcrypt.compare(password,user.password,(err,matched)=>{
            if(err){
                console.log(error);
                return error;
            }
            if(matched){
                return done(null,user);
            }
            else{
                return done(null,false,{message:"Incorrect password"});
            }

        });
    }).catch(error=>{
        console.log(error);
    })

}))
passport.serializeUser((user,done)=>{
        done(null,user.id);
});
passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user);
    })
})

////Registration: requires 2 routes
//First is to render the handlebar
//Second is to get the data from the form and add it to the database to create a new user
router.get("/register",(req,res)=>{
    res.render("home/register");
});
router.post("/register",(req,res)=>{
    let errors=[];
    if(!req.body.firstName){
        errors.push({message:"Please enter first name"});
    }
    if(!req.body.lastName){
        errors.push({message:"Please enter last name"});
    }
    if(!req.body.email){
        errors.push({message:"Please enter email"});
    }
    if(!req.body.password){
        errors.push({message:"Please enter password"});
    }
    if(req.body.password !== req.body.passwordConfirm){
        errors.push({message:"Password fields don't match"});
    }
    User.findOne({email:req.body.email}).then(found=>{
        if(found){
            let notRegister=[];
            notRegister.push({message:"This email address already exists"});
            res.render("home/register",{notRegister:notRegister});
        }
        else{
            const user=new User({
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.email,
                password:req.body.password,
        
            })
         
            if(errors.length>0){
                res.render("home/register",{errors:errors,user:user});
            }
            else{
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(user.password,salt,(err,hash)=>{ //hash is the hashed password that is to be saved in database
                        user.password=hash;
                        user.save().then(saved=>{
                            let success=[];
                            success.push({message:"You have been registered successfully"});
                            res.render("home/register",{success:success});
                         })
                    });
                });
            }
          
        }
    })


  
});
/////////Logout
router.get("/logout",userAuthenticated,(req,res,next)=>{
    req.logOut();
    res.render("home/login");
});

//////////

router.get("/description/:title",(req,res)=>{
    let title=req.params.title;
    Post.findOne({title:title}).populate("user").populate({path:"comments",populate:{path:"user",model:"User"}}).then(post=>{
        Category.find({}).then(categories=>{
            res.render("home/description",{post:post,categories:categories});
        })

       
    })
    
});
router.get("/admin",userAuthenticated,(req,res,next)=>{

    Post.countDocuments().then(count=>{
        res.render("admin/index",{count:count});

    })
 
        
      


   
});

module.exports=router;