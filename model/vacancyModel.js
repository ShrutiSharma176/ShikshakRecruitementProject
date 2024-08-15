import mongoose from "../connection/dbConfig.js";

var vacancySchema = mongoose.Schema({
    post:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    vacancy:{
        type:String,
        required:true
    },
    salary:{
        type:String,
        required:true
    },
    advdate:{
        type:String,
        required:true
    },
    lastdate:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    recruiter:{
        type:String,
        required:true
    },
    recruitername:{
        type:String,
        required:true
    }
});

export default mongoose.model("vacancySchema",vacancySchema,"vacancy");