//this is server
//Initializing server

const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");

const bodyParser=require("body-parser");
app.use(express.urlencoded({extended: true})); 
app.use(express.json());   
const {allowInsecurePrototypeAccess}=require("@handlebars/allow-prototype-access");
const Handlebars=require("handlebars");
const methodOverride=require("method-override");
const passport=require("passport");


mongoose.connect("mongodb://localhost:27017/CMS",{useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.once("open",()=>{
    console.log("CONNECTED");
}).on("error",(error)=>{
    console.log(error);
})
const {mongoDbUrl}=require("./config/database");
app.use(methodOverride("_method"));
const {select,generateTime,paginate}=require("./helpers/handlebars-helpers");
app.use(express.static(path.join(__dirname,"/public/")));
const handle=require("express-handlebars");
const exphbs = require("express-handlebars");
const upload=require("express-fileupload");
//for flash messages
const session=require("express-session");
const flash=require("connect-flash");

///Flash middleware, sessions are required for flash:
//Sessions middleware
app.use(session({
    secret:"18L0983",
    resave:true,
    saveUninitialized:true

}));
app.use(passport.initialize());
app.use(passport.session());
//Flash middleware
app.use(flash());

//Local  variables using middleware
app.use((req,res,next)=>{
    res.locals.success_message=req.flash("success message"); //Because of this, we have a success message variable to use in handlebars
    res.locals.error_message=req.flash("error message");
    res.locals.user= req.user || null; 
    res.locals.error=req.flash("error");
    next();
});
//Upload middleware
app.use(upload());

//npm install express-handlebars
app.engine("handlebars",exphbs({handlebars:allowInsecurePrototypeAccess(Handlebars),defaultLayout:"home",helpers:{select:select,generateTime:generateTime,paginate:paginate}}));
app.set("view engine","handlebars");
///Passport


//Load routes
const main=require("./routes/home/main");  //user side
const admin=require("./routes/admin/admin");  //admin side
const posts=require("./routes/admin/posts") //to get all posts
const categories=require("./routes/admin/categories");
const comments=require("./routes/admin/comments");
//Use routes
app.use("/",main);

app.use("/admin",admin);
app.use("/admin/posts",posts);
app.use("/admin/categories",categories);
app.use("/admin/comments",comments);
app.listen(5000,(error)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log("Listening"); 
    }
});

