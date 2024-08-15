import mongoose from 'mongoose';
var url = "mongodb+srv://alokshruti123:root@cluster0.ksiwiia.mongodb.net/FacultyRecruitment?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(url);

export default mongoose;