const express=require("express");
const app=express();
const router=express.Router();
const path=require("path");
app.use(express.static(path.join(__dirname,"public")));
const handle=require("express-handlebars");
const exphbs = require("express-handlebars");
//npm install express-handlebars
app.engine("handlebars",exphbs({defaultLayout:"admin"}));
app.set("view engine","handlebars");
const {userAuthenticated}=require("../../helpers/authentication")
const bcrypt=require("bcryptjs");
const passport=require("passport");

const localStrategy=require("passport-local").Strategy;
//router.all("/*",userAuthenticated,(req,res,next)=>{
//        req.app.locals.defaultLayout="admin";
//})


module.exports=router;