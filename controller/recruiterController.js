import recruiterModel from "../model/recruiterModel.js";
import applyVacancyModel from "../model/applyVacancyModel.js";
import candidateModel from "../model/candidateModel.js";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import mailer from '../controller/mailer.js';
import jwt from "jsonwebtoken";
import vacancyModel from "../model/vacancyModel.js";

dotenv.config();
var recruiter_secret_key = process.env.SECRET_KEY;

export const registrationController = async (request, response) => {
    try {
        var obj = {
            name: request.body.name,
            recruiter: request.body.recruiter,
            _id: request.body._id,
            password: await bcrypt.hash(request.body.password, 10),
            contact: request.body.contact,
            address: request.body.address
        }
        // https://facultyrecruitmentsystem.onrender.com/candidate/verifyemail?email="+email+"
        // https://shikshakrecruitement.onrender.com/
        // var data = "Hello " + request.body._id + ", This is verification mail please <a href = 'http://localhost:3000/recruiter/verifyEmail?email=" + request.body._id + "'>Click this link</a> for verification";
        var data = "Hello " + request.body._id + ", This is verification mail please....<a href = 'http://shikshakrecruitement.onrender.com/recruiter/verifyEmail?email=" + request.body._id + "'>Click this link</a> for verification";

        mailer.mailer(request.body._id, data, async (info) => {
            if (info) {
                console.log("Mail sent from controller message");

                var res = await recruiterModel.create(obj);
                console.log("res value of Recruiter registration Controller :", res);

                response.render("recruiterLogin", { msg: "Mail sent successfully | Please Verify...." })
            }
        });

    } catch (error) {
        console.log("Error in registration Controller : ", error);
    }
}

export const verifyEmailController = async (request, response) => {
    try {
        var email = request.query.email;
        var updateEmailStatus = {
            $set: {
                emailverify: "Verified"
            }
        }

        var res = await recruiterModel.updateOne({ _id: email }, updateEmailStatus);

        response.render("recruiterlogin", { msg: "Email Verified Successfully" });

    } catch (error) {
        console.log("Error in verifyEmailController : " + error);
    }
}

export const loginController = async (request, response) => {
    try {
        var expireTime = {
            expiresIn: "1d"
        }

        var token = jwt.sign({ _id: request.body._id }, recruiter_secret_key, expireTime);

        if (!token) {
            console.log("Error while generating token in recruiter login");
        } else {
            response.cookie("recruiter_jwt", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });

            var res = await recruiterModel.findOne({ _id: request.body._id, adminverify: "Verified", emailverify: "Verified" ,status:true});

            if (res != null) {
                var status = await bcrypt.compare(request.body.password, res.password);

                if (status) {
                    response.render("recruiterHomePage", { email: request.body._id })
                } else {
                    response.render("recruiterLogin", { msg: "Error while comparing password" });
                }
            }
            else {
                response.render("recruiterLogin", { msg: "you entered either wrong email or not verify by admin and you don't verify your email" });
            }
        }

    } catch (err) {
        console.log("Error in recruiter LoginController : ", err);
    }
}

export const logoutController = async (request, response) => {
    try {
        response.clearCookie("recruiter_jwt");
        response.render("recruiterlogin", { msg: "Logout Sucessfull" })
    } catch (err) {
        console.log("Error in recruiter LogoutController : ", err);
    }
}

export const addVacancyController = async (request, response) => {
    try {
        var res = await vacancyModel.create(request.body);

        console.log(res);
        response.render("recruiterhomepage", { email: request.payload._id });
    }
    catch (err) {
        console.log("Error in recruiter addVacancyController : ", err);
    }
}

export const appliedCandidateListController = async (request, response) => {
    try {
        var res = await applyVacancyModel.find({recruiterEmail:request.payload._id});
        var arr = [];
        for (var index in res) {
            var res1 = await candidateModel.findOne({ _id: res[index].candidateEmail });

            arr.push(res1.file);
            // arr = [...arr,res1.file];
        }
        console.log(arr);
        response.render("appliedCandidateList", { obj: res, arr: arr, email: request.payload._id });
    } catch (err) {
        console.log("Error in recruiter appliedCandidateListController : ", err);
    }

}

export const updateStatusController = async(request,response)=>{
    try{
        var {vid,candidateEmail} = request.query;

        var updateData = {$set:{
            statusByRecruiter : "ShortList"
        }};

        await applyVacancyModel.updateOne({vacancyId : vid, candidateEmail: candidateEmail},updateData);

        var res = await applyVacancyModel.find();
        var arr = [];
        for(var index in res ){
            var res1 = await candidateModel.findOne({ _id: res[index].candidateEmail });

            arr.push(res1.file);
            // arr = [...arr,res1.file];
        }
        console.log(arr);
        response.render("appliedCandidateList", { obj: res, arr: arr, email: request.payload._id });

    }catch(err){
        console.log("Error in recruiter updateStatusController : ", err);
    }
}

export const viewProfileController = async(request,response)=>{
    try{
        var res = await recruiterModel.findOne({_id : request.payload._id});
        //console.log(request.cookies.recruiter_jwt);
        response.render("recruiterViewProfile",{obj:res,email:request.payload._id})
    }catch(err){
        console.log("Error in recruiter viewProfileController : ", err);
    }
}

export const updateProfileController = async(request,response)=>{
    try{
        var updateQuery = {$set:{
            name: request.body.name,
            recruiter: request.body.recruiter,
            contact: request.body.contact,
            address: request.body.address
        }}
        var res = await recruiterModel.updateOne({_id : request.body._id},updateQuery);
        //console.log(res);
        
        response.render("recruiterhomepage", { email: request.body._id });

    }catch(err){
        console.log("Error in recruiter updateProfileController : ", err);
    }
}

export const updatePasswordController = async(request,resposne)=>{
    try{
        var email = request.payload._id;
        var password = request.body.password;
        var cPassword = request.body.cPassword;
        var updateQuery = {$set:{password:await bcrypt.hash(request.body.password, 10) }};

        if(cPassword==password){
            await recruiterModel.updateOne({_id:email},updateQuery);
            resposne.render("recruiterUpdatePassword",{email:request.payload._id,msg:"Password Updated Successfully"});
        }else{
            resposne.render("recruiterUpdatePassword",{email:request.payload._id,msg:"Password not matching"});
        }
    }catch(err){
        console.log("Error in recruiter updatePasswordController : ", err);
    }
}

export const deactivateController = async(request,response)=>{
    try{
        var email = request.payload._id;
        await recruiterModel.updateOne({_id:email},{$set:{status:false}});
        response.render("recruiterlogin", { msg: "Your Account is Deactivated" })

    }catch(err){
        console.log("Error in recruiter deactivateController : ", err);
    }
}