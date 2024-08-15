import mongoose from "../connection/dbConfig.js";

var applyVacancy = mongoose.Schema({
    vacancyId:{
        type:String,
        required:true
    },
    candidateEmail:{
        type:String,
        required:true
    },
    recruiterEmail:{
        type:String,
        required:true
    },
    post:{
        type:String,
        required:true
    },
    statusByRecruiter:{
        type:String,
        default:"Applied"
    }
});

export default mongoose.model("applyVacancySchema",applyVacancy,"applyVacancy");