import mongoose from "../connection/dbConfig.js";

var recruiterSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    recruiter:{
        type:String,
        required:true
    },
    _id:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    adminverify:{
        type:String,
        default:"Not Verified",
        required:true
    },
    emailverify:{
        type:String,
        default:"Not Verified",
        required:true
    },
    
    status:{
        type:Boolean,
        required:true,
        default:true
    },
});

export default mongoose.model("recruiterSchema",recruiterSchema,"recruiter");