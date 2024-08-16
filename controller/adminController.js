import adminModel from '../model/adminModel.js';
import recruiterModel from '../model/recruiterModel.js';
import candidateModel from '../model/candidateModel.js';
import vacancyModel from "../model/vacancyModel.js";
import applyVacancyModel from "../model/applyVacancyModel.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();
const admin_secret_key = process.env.SECRET_KEY;

export const adminLoginController = async (request, response) => {
    var obj = request.body;
    try {
        // var expireTime = {
        //     expiresIn: '1d'
        // };
        // var token = jwt.sign({ _id: request.body._id }, admin_secret_key, expireTime);

        // if (!token) {
        //     response.render("index");
        // } else {
        //     response.cookie("admin_jwt", token, { maxage: 24 * 60 * 60 * 1000, httpOnly: true });
            var adminEmail = await adminModel.findOne({ _id: request.body._id });
            // console.log("adminEmail : "+adminEmail); 
            if (adminEmail != null) {
                var adminPassword = await adminModel.findOne({ _id: request.body._id }, { password: 1, _id: 0 });

                var status = bcrypt.compare(adminPassword.password, obj.password);

                if (status) {
                    response.render("adminHomePage", { email: request.body._id });
                }
                else {
                    console.log("Error while admin Login");
                }
            } else {
                console.log("invalid email");
            }
    //     }
    } catch (error) {
        console.log("error in adminLoginController : ", error);
    }
}

export const adminViewRecruiterListController = async (request, response) => {
    try {
        var res = await recruiterModel.find();
        // response.render("adminViewRecruiterList", { obj: res, email: request.payload._id });
        response.render("adminViewRecruiterList", { obj: res, email:"" });
    } catch (error) {
        console.log("Error in adminViewRecruiterListController : ", error);
    }
}

export const adminVerifyRecruiterController = async (request, response) => {
    try {
        var email = request.query.email;
        var updateAdminVerify = {
            $set: {
                adminverify: "Verified"
            }
        };

        var res = await recruiterModel.updateOne({ _id: email }, updateAdminVerify);

        var res1 = await recruiterModel.find();

        response.render("adminViewRecruiterList", { obj: res1, email: request.query.adminEmail });
    } catch (error) {
        console.log("Error in adminVerifyRecruiterController : ", error);
    }
}

export const adminViewCandidateListController = async (request, response) => {
    try {
        var res = await candidateModel.find();
        // response.render("adminViewCandidateList", { obj: res, email: request.payload._id });
        response.render("adminViewCandidateList", { obj: res, email: "" });
    } catch (error) {
        console.log("Error in adminViewCandidateListCntroller : " + error);
    }
}


export const adminVerifyCandidateController = async (request, response) => {
    try {
        var email = request.query.email;
        var updateAdminVerify = {
            $set: {
                adminverify: "Verified"
            }
        };

        var res = await candidateModel.updateOne({ _id: email }, updateAdminVerify);

        var res1 = await candidateModel.find();

        response.render("adminViewCandidateList", { obj: res1, email: request.query.adminEmail });
    } catch (error) {
        console.log("Error in adminVerifyCandidateController : ", error);
    }
}

export const logoutController = async (request, response) => {
    try {
        response.clearCookie("admin_jwt");
        response.render("adminLogin", { msg: "Logout Sucessfull" });
    } catch (err) {
        console.log("Error in logoutController : ", err);
    }
}

export const adminViewVacancyListController = async (request, response) => {
    try {
        var res = await vacancyModel.find();
        // response.render("adminViewVacancy", { obj: res, email: request.payload._id });
        response.render("adminViewVacancy", { obj: res, email: "" });
    } catch (err) {
        console.log("Error in adminViewVacancyListController : ", err);
    }
}

export const adminViewAppliedCandidateListController = async (request, response) => {
    try {
        var res = await applyVacancyModel.find();
        var arr = [];
        for (var index in res) {
            var res1 = await candidateModel.findOne({ _id: res[index].candidateEmail });

            arr.push(res1.file);
            // arr = [...arr,res1.file];
        }
        console.log(arr);
        // response.render("adminViewAppliedCandidateList", { obj: res, arr: arr, email: request.payload._id });
        response.render("adminViewAppliedCandidateList", { obj: res, arr: arr, email: "" });
    } catch (err) {
        console.log("Error in adminViewAppliedCandidateList : ", err);
    }
}