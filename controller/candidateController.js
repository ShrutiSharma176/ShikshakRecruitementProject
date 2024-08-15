import candidateModel from '../model/candidateModel.js';
import vacancyModel from "../model/vacancyModel.js";
import applyVacancyModel from "../model/applyVacancyModel.js";
import mailer from "./mailer.js";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();
const candidate_secret_key = "asdfghjklpoiuytrewqzxcvbnm";

export const registrationController = async (request, response) => {
    console.log(request.body._id);
    var data = "Hello " + request.body._id + ", This is verification mail please <a href='http://localhost:3000/candidate/verifyEmail?email=" + request.body._id + "'>Click This Link</a> for verification";
    console.log(request.body._id);

    mailer.mailer(request.body._id, data, (info) => {
        if (info) {
            var fileUrl = fileURLToPath(import.meta.url);

            var __dirname = path.dirname(fileUrl).replace("\\controller", "");

            var filename = request.files.file;
            var fileName = new Date().getTime() + filename.name;

            var pathname = path.join(__dirname, "/public/", fileName);
            filename.mv(pathname, async (err) => {
                if (err) {
                    console.log("Error in file uploading " + err);
                }
                else {
                    try {
                        var obj = {
                            firstname: request.body.firstname,
                            lastname: request.body.lastname,
                            _id: request.body._id,
                            password: await bcrypt.hash(request.body.password, 10),
                            gender: request.body.gender,
                            date: request.body.date,
                            address: request.body.address,
                            mobile: request.body.mobile,
                            qualification: request.body.qualification,
                            percentage: request.body.percentage,
                            experience: request.body.experience,
                            file: fileName
                        };

                        var res = await candidateModel.create(obj);

                        console.log("res in candidateRegistrationController :" + res);

                        response.render("candidateLogin", { msg: "Registration Successfully" });
                    } catch (error) {
                        console.log("Error in candidateRegistrationController " + err);
                    }
                }
            });
        }
    });
}


export const verifyEmailController = async (request, response) => {
    try {
        var res = await candidateModel.updateOne({ _id: request.query.email }, { $set: { emailverify: "Verified" } });

        console.log("res in candidate verifyemail : " + res);

        response.render("candidateLogin", { msg: "email verified successfully" });
    } catch (error) {
        console.log("Error in verifyEmailCOntoller in candiadte controller : " + error);
    }
}

export const loginController = async (request, response) => {
    try {
        var expireTime = {
            expiresIn: "1d"
        }
        var token = jwt.sign({ _id: request.body._id }, candidate_secret_key, expireTime);

        if (!token)
            console.log("Error while creating token in candidate login");
        else {
            response.cookie("candidate_jwt", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });

            var res = await candidateModel.findOne({ _id: request.body._id, emailverify: "Verified", adminverify: "Verified" , status:true});

            console.log(res);
            if (res != null) {
                var status = await bcrypt.compare(request.body.password, res.password);
                if (status) {
                    response.render("candidateHomePage", { email: request.body._id });
                }
                else {
                    response.render("candidateLogin", { msg: "you entered wrong password" });
                }
            } else {
                response.render("candidatelogin", { msg: "you entered wrong email id or password" });
            }
        }
    } catch (err) {
        console.log("Error in candidateLoginController : ", err);
    }
}


export const logoutController = async (request, response) => {
    try {
        response.clearCookie("candidate_jwt");
        response.render("candidateLogin", { msg: "Logout Sucessfull" });
    } catch (err) {
        console.log("Error in logoutController of candidate : ", err);
    }
}

export const viewVacancyController = async (request, response) => {
    try {
        var res = await vacancyModel.find();
        console.log(res);
        response.render("candidateViewVacancy", { obj: res, email: request.payload._id });
    } catch (err) {
        console.log("Error in viewVacancyController of candidate : ", err);
    }
}

export const viewStatusController = async (request, response) => {
    try {
        var res = await applyVacancyModel.find({ candidateEmail: request.payload._id });

        response.render("viewCandidateStatus", { obj: res, email: request.payload._id });

    } catch (err) {
        console.log("Error in viewStatusController of candidate : ", err);
    }
}

export const applyVacancyController = async (request, response) => {
    try {
        var candidateEmail = request.query.email;
        var vid = request.query.vid;
        var res = await vacancyModel.findOne({ _id: vid }, { email: 1, post: 1 });
        console.log("res : " + res);
        var obj = {
            vacancyId: res._id,
            post: res.post,
            candidateEmail: candidateEmail,
            recruiterEmail: res.email
        }
        var res1 = await applyVacancyModel.create(obj);
        console.log("res1 : " + res1);

        var obj = await vacancyModel.find();
        response.render("candidateViewVacancy", { obj: obj, email: candidateEmail });
    } catch (err) {
        console.log("Error in applyVacancyController of candidate : ", err);
    }
}

export const deactivateController = async (request, response) => {
    try {
        var email = request.payload._id;
        await candidateModel.updateOne({ _id: email }, { $set: { status: false } });
        response.render("candidateLogin", { msg: "Your Account is Deactivated" })

    } catch (err) {
        console.log("Error in candiadte deactivateController : ", err);
    }
}

export const viewProfileController = async (request, response) => {
    try {
        var res = await candidateModel.findOne({ _id: request.payload._id });
        console.log(res);
        response.render("candidateViewProfile", { obj: res, email: request.payload._id })
    } catch (err) {
        console.log("Error in candidate viewProfileController : ", err);
    }
}

export const updateProfileController = async (request, response) => {
    try {
        var updateQuery = {
            $set: {
                firstname: request.body.firstname,
                lastname: request.body.lastname,
                gender: request.body.gender,
                date: request.body.date,
                address: request.body.address,
                mobile: request.body.mobile,
                qualification: request.body.qualification,
                percentage: request.body.percentage,
                experience: request.body.experience
            }
        }
        var res = await candidateModel.updateOne({ _id: request.body._id }, updateQuery);
        //console.log(res);

        response.render("candidatehomepage", { email: request.body._id });

    } catch (err) {
        console.log("Error in candidate updateProfileController : ", err);
    }
}

export const updatePasswordController = async(request,resposne)=>{
    try{
        var email = request.payload._id;
        var password = request.body.password;
        var cPassword = request.body.cPassword;
        var updateQuery = {$set:{password:await bcrypt.hash(request.body.password, 10) }};

        if(cPassword==password){
            await candidateModel.updateOne({_id:email},updateQuery);
            resposne.render("candidateUpdatePassword",{email:request.payload._id,msg:"Password Updated Successfully"});
        }else{
            resposne.render("candidateUpdatePassword",{email:request.payload._id,msg:"Password not matching"});
        }
    }catch(err){
        console.log("Error in candidate updatePasswordController : ", err);
    }
}