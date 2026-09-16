const internshipMatcher = require("../utils/internshipMatcher")
const profileModel = require("../models/profile.model")
const internshipModel = require('../models/internship.model')
const applicationModel = require("../models/application.model");

async function recommendation(req, res) {
    try {
        const userId = req.user.id
        const profile = await profileModel.findOne({ userId })
        if (!profile) {
            return res.status(404).json({
                message: "Profile Not Exists"
            })
        }
        const applications = await applicationModel.find({
    studentId: userId
});

const appliedInternshipIds = applications.map(
    application => application.internshipId.toString()
);
        const internships = await internshipModel.find({
            status: "active",
            _id: { $nin: appliedInternshipIds }
        });
        if (internships.length === 0) {
            return res.status(404).json({
                message: "No active internships available"
            });
        }

        const recommendations = internships
    .map(internship => {

        const match = internshipMatcher.calculateMatchScore(
            profile,
            internship
        );

        if (!match) {
            return null;
        }

        return {
            internship,
            ...match
        };
    })
    .filter(recommendation => recommendation !== null);
        recommendations.sort((a, b) => b.score - a.score);
        if(recommendations.length === 0){
            return res.status(404).json({
                message:"No internship Match found"
            })
        }
        return res.status(200).json({
            recommendations,
            message: "Recommendations generated successfully"
        });

    }
    catch (err) {
        console.log("Error in Recommendation:", err);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

module.exports = { recommendation }