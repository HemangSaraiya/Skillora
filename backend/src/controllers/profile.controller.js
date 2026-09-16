const profileModel = require('../models/profile.model')

async function createProfile(req, res) {
    try {
        const userId = req.user.id;

        const {
            education,
            currentYear,
            cgpa,
            skills,
            projects,
            experience,
            preferredDomains
        } = req.body || {};

        const existingProfile = await profileModel.findOne({ userId });

        if (existingProfile) {
            return res.status(409).json({
                message: "Profile already exists"
            });
        }

        const profile = await profileModel.create({
            userId,
            education,
            currentYear,
            cgpa,
            skills,
            projects,
            experience,
            preferredDomains
        });

        return res.status(201).json({
            profile,
            message: "Profile created successfully"
        });

    } catch (err) {
        console.log("Error in createProfile:", err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function getProfile(req,res){
    try{

        const userId=req.user.id
        const profile=await profileModel.findOne({userId})
        if(!profile){
            return res.status(404).json({
                message:"Profile not found"
            })
        }
        return res.status(200).json({
            profile
        })
    }
    catch(err){
        console.log("Error in getprofile:",err)
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

async function updateProfile(req,res){
    try{
        const userId=req.user.id
        const{
            education,
            currentYear,
            cgpa,
            skills,
            projects,
            experience,
            preferredDomains
        }=req.body
        const updates={}
        if(education!==undefined){
            updates.education=education
        }
        if(skills!==undefined){
            updates.skills=skills
        }
        if(currentYear!==undefined){
            updates.currentYear=currentYear
        }
        if(cgpa!==undefined){
            updates.cgpa=cgpa
        }
        if (projects !== undefined) {
            updates.projects = projects;
        }
        if(experience!==undefined){
            updates.experience=experience
        }
        if(preferredDomains!==undefined){
            updates.preferredDomains=preferredDomains
        }
        const profile=await profileModel.findOneAndUpdate(
            {userId},
            {$set:updates},
            {
                returnDocument:"after",
                runValidators:true
            }
        )
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        return res.status(200).json({
            profile,
            message: "Profile updated successfully"
        });
    }
    catch(err){
        console.log("Error in updateprofile:",err)
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

module.exports={createProfile,getProfile,updateProfile}