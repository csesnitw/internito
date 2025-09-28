const mongoose = require("mongoose");

/*
* The `admins` collection will be used to store the admin users by email.
*/
const adminSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true,
        increment: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    }, 
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);
