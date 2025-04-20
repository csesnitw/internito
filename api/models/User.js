const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    rollNo: {
        type: String,
        unique: true,
    },
    profilePic: {
        type: String,
        default: "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?size=338&ext=jpg&ga=GA1.1.1546980028.1704153600&semt=ais"
    },
    branch: {
        type: String
    },
    yearOfStudy: {
        type: Number
    }
});

module.exports = mongoose.model("User", userSchema);