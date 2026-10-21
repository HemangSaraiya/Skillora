
const internshipMatcher = require("../utils/internshipMatcher");
const profileModel = require("../models/profile.model");
const internshipModel = require("../models/internship.model");
const applicationModel = require("../models/application.model");

async function recommendation(req, res) {
    try {
        const userId = req.user.id;

        const profile = await profileModel.findOne({ userId });

        if (!profile) {
            return res.status(404).json({
                recommendations: [],
                message: "Please create your profile before requesting recommendations."
            });
        }

        // Find internships the student has already applied to.
        const applications = await applicationModel.find({
            studentId: userId
        }).select("internshipId");

        const appliedInternshipIds = applications.map(
            application => application.internshipId
        );

        // Only recommend active, non-expired internships that the student
        // has not already applied to.
        const internships = await internshipModel.find({
            status: "active",
            applicationDeadline: { $gt: new Date() },
            _id: { $nin: appliedInternshipIds }
        });

        if (internships.length === 0) {
            return res.status(200).json({
                recommendations: [],
                message: "No new active internships are available."
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
            .filter(Boolean)
            .sort((a, b) => b.score - a.score);

        return res.status(200).json({
            recommendations,
            message: recommendations.length
                ? "Recommendations generated successfully."
                : "No internships currently match your eligibility."
        });
    } catch (err) {
        console.error("Error in recommendation:", err);

        return res.status(500).json({
            recommendations: [],
            message: "Internal Server Error"
        });
    }
}

module.exports = { recommendation };
