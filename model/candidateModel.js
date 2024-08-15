import mongoose from "../connection/dbConfig.js";

var candidateSchema = mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
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
    gender:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    percentage:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    file:{
        type:String,
        required:true
    },
    adminverify:{
        type:String,
        default :"Not Verified",
        required:true
    },
    emailverify:{
        type:String,
        default :"Not Verified",
        required:true
    },
    status:{
        type:Boolean,
        required:true,
        default:true
    },
});

export default mongoose.model("candidateSchema",candidateSchema,"candidate");