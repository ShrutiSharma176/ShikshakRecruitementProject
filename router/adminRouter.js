import express  from "express";
import dotenv from 'dotenv';
import { adminLoginController, adminViewRecruiterListController,adminVerifyRecruiterController,adminViewCandidateListController, adminVerifyCandidateController, logoutController ,adminViewVacancyListController,adminViewAppliedCandidateListController} from "../controller/adminController.js";
import jwt from "jsonwebtoken";
var adminRouter = express.Router();

dotenv.config();
const admin_secret_key = process.env.SECRET_KEY;

adminRouter.use(express.static('public'));

const authenticateJWT = (request,response,next)=>{
    var token =request.cookies.admin_jwt;
    console.log("token in adminRouter ");
    if(!token){
        //response.render("adminLogin",{msg:""});
        response.redirect("https://shikshakrecruitement.onrender.com/admin");
    }else{
        jwt.verify(token,admin_secret_key,(error,payload)=>{
            if(error){
                console.log("error in admin router in authenticate");
            }else{
                console.log(payload);
                request.payload = payload;
                next();
            }
        });
    }
}

adminRouter.get("/",authenticateJWT,(request,response)=>{
    response.render("adminHomePage",{email:request.payload._id});
});
adminRouter.get("/adminHomePage",authenticateJWT,(request,response)=>{
    response.render("adminHomePage",{email:request.payload._id});
});

adminRouter.post("/login",adminLoginController);

adminRouter.get("/adminViewRecruiterList",authenticateJWT,adminViewRecruiterListController);

adminRouter.get("/adminVerifyEmail",adminVerifyRecruiterController);

adminRouter.get("/adminViewCandidateList",authenticateJWT,adminViewCandidateListController);

adminRouter.get("/adminVerifyCandidate",adminVerifyCandidateController);
adminRouter.get("/adminViewVacancyList",authenticateJWT,adminViewVacancyListController);
adminRouter.get("/adminViewAppliedCandidateList",authenticateJWT,adminViewAppliedCandidateListController);
adminRouter.get("/logout",logoutController);

export default adminRouter;