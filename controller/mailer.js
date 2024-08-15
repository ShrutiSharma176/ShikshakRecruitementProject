import nodemailer from 'nodemailer';

const mailer = function(email,data,callback){
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"alokshruti123@gmail.com",
            pass:"ebyl lprk tapn cwgu"
        }
    });

    const mailoption = {
        from :"alokshruti123@gmail.com",
        to : email,
        subject :"Verification Mail",
        html:data
    }

    transporter.sendMail(mailoption,(err,info)=>{
        if(err){
            console.log("Error in mailer : "+err);
        }
        else{
            console.log("Mail sent from Mailer");
            callback(info);
        }
    });
}

export default {mailer:mailer};