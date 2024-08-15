import express from "express";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import { applyVacancyController, loginController, logoutController, registrationController,verifyEmailController, viewStatusController, viewVacancyController,deactivateController ,viewProfileController,updateProfileController,updatePasswordController} from "../controller/candidateController.js";

dotenv.config();
const candidate_secret_key = "asdfghjklpoiuytrewqzxcvbnm";

var candidateRouter = express.Router();

candidateRouter.use(express.static('public'));

var authenticateJWT = (request,response,next)=>{
    var token = request.cookies.candidate_jwt;

    if(!token){
        response.render("candidateLogin",{msg:""});
    }
    else{
        jwt.verify(token,candidate_secret_key,(error,payload)=>{
            if(error){
                console.log("Error in authenticateJWT in candiadteRouter : "+error);
            }
            else{
                request.payload = payload;
                next();
            }
        });
    }
}

candidateRouter.get("/candidateLogin",authenticateJWT,(request,response)=>{
    response.render("CandidateHomePage",{email:request.payload._id});
});
candidateRouter.get("/candidateRegistration",(request,response)=>{
    response.render("candidateRegistration");
});

candidateRouter.post("/registration",registrationController);
candidateRouter.get("/viewProfile",authenticateJWT,viewProfileController);
candidateRouter.post("/editProfile",authenticateJWT,(request,response)=>{
    var res = {
        firstname: request.body.firstname,
        lastname: request.body.lastname,
        _id: request.body._id,
        gender: request.body.gender,
        date: request.body.date,
        address: request.body.address,
        mobile: request.body.mobile,
        qualification: request.body.qualification,
        percentage: request.body.percentage,
        experience: request.body.experience,
        file: request.body.file
    };

    console.log(res);
    response.render("candidateEditProfile",{obj:res,email:request.payload._id});
});

candidateRouter.get("/updatePassword",authenticateJWT,(request,response)=>{
    response.render("candidateUpdatePassword",{email:request.payload._id,msg:""});
});
candidateRouter.post("/updatePassword",authenticateJWT,updatePasswordController);
candidateRouter.post("/updateProfile",authenticateJWT,updateProfileController);
candidateRouter.post("/login",loginController)
candidateRouter.get("/verifyEmail",verifyEmailController);
candidateRouter.get("/viewVacancy",authenticateJWT,viewVacancyController);
candidateRouter.get("/viewStatus",authenticateJWT,viewStatusController);
candidateRouter.get("/applyVacancy",applyVacancyController);
candidateRouter.get("/logout",logoutController);
candidateRouter.get("/deactivate",authenticateJWT,deactivateController);
export default candidateRouter;