import express  from "express";
import { registrationController, verifyEmailController,loginController,logoutController,addVacancyController}  from "../controller/recruiterController.js";
import {appliedCandidateListController, updateStatusController,viewProfileController,updateProfileController,updatePasswordController,deactivateController} from "../controller/recruiterController.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import recruiterModel from "../model/recruiterModel.js";

var recruiterRouter = express.Router();

recruiterRouter.use(express.static('public'));

dotenv.config();
const recruiter_secret_key = process.env.SECRET_KEY;

var authenticateJWT = (request,response,next)=>{
    var token = request.cookies.recruiter_jwt;
    var msg = request.query.message;

    if(!token){
        response.render("recruiterLogin",{msg : msg});
    }
    else{
        jwt.verify(token,recruiter_secret_key,(error,payload)=>{
            if(error){
                console.log("Error in recruiter authentication : ",error);
            }
            else{
                request.payload=payload;
                next();
            }
        });
    }
}

recruiterRouter.get("/recruiterLogin",authenticateJWT,(request,response)=>{
    response.render("recruiterHomePage",{email:request.payload._id}); 
});
recruiterRouter.get("/recruiterRegistration",(request,response)=>{
    response.render("recriterRegistration");
});
recruiterRouter.get("/verifyEmail",verifyEmailController);
recruiterRouter.get("/addVacancy",authenticateJWT,async(request,response)=>{
    try{
        var res = await recruiterModel.findOne({_id:request.payload._id});

        response.render("vacancyForm",{obj:res,email : request.payload._id});
    }catch(err){
        console.log("Error in vacancy form render catch :",err);
    }
});

recruiterRouter.post("/registration",registrationController);
recruiterRouter.post("/login",loginController);
recruiterRouter.post("/addVacancy",authenticateJWT,addVacancyController);
recruiterRouter.post("/editProfile",authenticateJWT,(request,response)=>{
    var res = {
        name: request.body.name,
        recruiter: request.body.recruiter,
        _id: request.body._id,
        contact: request.body.contact,
        address: request.body.address
    }
    console.log(res);
    response.render("recuriterEditProfile",{obj:res,email:request.payload._id});
});
recruiterRouter.post("/updateProfile",updateProfileController);
recruiterRouter.post("/updatePassword",authenticateJWT,updatePasswordController);

recruiterRouter.get("/viewProfile",authenticateJWT,viewProfileController);
recruiterRouter.get("/appliedCandidateList",authenticateJWT,appliedCandidateListController);
recruiterRouter.get("/updateStatus",authenticateJWT,updateStatusController);
recruiterRouter.get("/logout",logoutController);
recruiterRouter.get("/deactivate",authenticateJWT,deactivateController);
recruiterRouter.get("/updatePassword",authenticateJWT,(request,resposne)=>{
    resposne.render("recruiterUpdatePassword",{email:request.payload._id,msg:""});
});

export default recruiterRouter;