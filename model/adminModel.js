import mongoose from "../connection/dbConfig.js";

var adminSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

export default mongoose.model("adminSchema",adminSchema,"admin");