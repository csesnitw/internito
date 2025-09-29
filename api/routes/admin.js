const express = require("express");
const router = express.Router();
const AdminMod = require("../models/Admin");

const isAdmin = async (req, res, next) => {
    try{
        if(!req.isAuthenticated()){
            throw new Error("User is not authenticated");
        }
        const admin = await AdminMod.findOne({ email: req.user.user.email });
        if(!admin){
            throw new Error("User is not an admin");
        }
        next();
    } 
    catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

router.get("/checkAdmin", isAdmin, (req, res) => {
    res.status(200).json({
        success: true,
        message: "User is an admin",
        user: req.user
    });
});

module.exports = router;