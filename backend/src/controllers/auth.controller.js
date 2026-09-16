const userModel=require('../models/user.model')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')

async function registration(req,res){
    try{

        const {name,email,password,} =req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        const isUserExists=await userModel.findOne({
        email
    })
    if(isUserExists){
        return res.status(409).json({
            message:"User Already Exists"
        })
    }
    const hash=await bcrypt.hash(password,10)
    const user=await userModel.create({
        name,
        email,
        password:hash
    })
    const token=jwt.sign({
        id:user._id,
        role:user.role
    },process.env.JWT_SECRET,
    {
        expiresIn: "7d",
    })
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
        process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        skills: user.skills,
    };
    res.status(201).json({
        user:userData,
        message:"User Signed up successfully"
    })
}
catch(err){
    console.log("Registration error:",err);
    return res.status(500).json({
            message: "Internal server error",
        });
}
}

async function login(req,res){
    try{

        const {email,password}=req.body
        if(!email || !password){
            return res.status(400).json({
            message:"Email and password are required"
        })
    }
    const user=await userModel.findOne({
        email
    })
    if(!user ){
        return res.status(401).json({
    message: "Invalid email or password"
});
    }
    const passmatch=await bcrypt.compare(password,user.password)
    if(!passmatch){
        return res.status(401).json({
    message: "Invalid email or password"
});
    }
    const token=jwt.sign({
        id:user._id,
        role:user.role
    },process.env.JWT_SECRET,
    {
        expiresIn: "7d",
    })
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
        process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        skills: user.skills,
    };
    res.status(200).json({
        user:userData,
        message:"User logged in successfully"
    })
}
catch(err){
    return res.status(500).json({
            message: "Internal server error",
        });
}
}

async function getMe(req,res){
    try{
        const user=await userModel.findById(req.user.id)
        .select('-password')
        if(!user){
            return res.status(404).json({
                message:"User Not Found"
            })
        }
        return res.status(200).json({
            user
        });
    }
    catch(err){
        console.log("get user error:",err)
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

async function logout(req,res){
    try{
        res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
        process.env.NODE_ENV === "production" ? "none" : "lax",
    })
        res.status(200).json({
        message:"User Logged out"
    })
    }
    catch(err){
        console.log("logout error",err)
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

module.exports={registration,login,getMe,logout};