const Users =require('../models/user');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require('dotenv').config();

//Function to generate JWT token
const generateToken=(user)=>{
    return jwt.sign({
        userId:user._id,
        name:user.name,
        email:user.email

    },process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
}

//register controller
exports.registerController = async(req,res)=>{
    try{
        const{name, email, password} = req.body;

        // Check if user already exists
        let user = await Users.findOne({ email });
         if (user) return res.status(400).json({ message: "User already exists" });

        const newUser = await Users.create({name, email, password});
        console.log(newUser);

       

        res.status(201).json({
            success:true,
            message: "User Created Successfully",
           
        });

       
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            error : err.message
    });
    }
    }



 //login controller
exports.loginController=async(req,res)=>{
   try{
    const {email,password}=req.body;

    const user=await Users.findOne({email});
    if(!user){
        console.log("error fnd");
        return res.status(404).send("User not found");
    }

    //validate password
    const isPasswordValid=await user.comparePassword(password);
    if(!isPasswordValid){
        return res.status(400).send("Invalid credentials");
    }

    //generate jwt token
    const token=generateToken(user);

    console.log(user);
    console.log("User found");
    res.status(200).json({
        success:true,
        user,
        message:"Login Successful",
        token,
    });
   }
   catch(error){
    console.log(error);
    res.status(400).json({
        success:false,
        error: error.message
    });
   }
}



