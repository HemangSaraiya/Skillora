const applicationModel = require("../models/application.model")
const internshipModel = require("../models/internship.model");
const mongoose = require("mongoose");

async function createApplication(req, res) {
    try {
        const studentId = req.user.id
        const { internshipId, coverLetter } = req.body;
        if (!internshipId) {
            return res.status(400).json({
                message: "Internship ID is required"
            });
        }
        const internship = await internshipModel.findById(internshipId)
        if (!internship) {
            return res.status(404).json({
                message: "Internship not exists"
            })
        }
        if (internship.status !== "active") {
            return res.status(400).json({
                message: "Internship is not active"
            })
        }
        if (new Date() > internship.applicationDeadline) {
            return res.status(400).json({
                message: "Application deadline has passed"
            });
        }
        const existingApplication = await applicationModel.findOne({
            studentId,
            internshipId
        });

        if (existingApplication) {
            return res.status(409).json({
                message: "You have already applied for this internship"
            });
        }
        const application = await applicationModel.create({
            studentId,
            internshipId,
            coverLetter
        })
        return res.status(201).json({
            application,
            message: "Application created successfully"
        })
    }
    catch (err) {
        console.log("createApplication error", err)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function myApplications(req, res) {
    try {
        const studentId = req.user.id
       const applications = await applicationModel
    .find({ studentId })
    .populate({
        path: "internshipId",
        populate: {
            path: "companyId",
            select: "name"
        }
    });
        if (applications.length === 0) {
            return res.status(404).json({
                message: "You haven't applied in any internship yet"
            })
        }
        return res.status(200).json({
            applications,
            message: "My-applications featched successfully"
        })
    }
    catch (err) {
        console.log("myApplications error", err)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function getInternshipApplicants(req, res) {
    try {
        const internshipId = req.params.internshipId
        if (!mongoose.Types.ObjectId.isValid(internshipId)) {
            return res.status(400).json({
                message: "Invalid internship ID"
            });
        }
        if (!internshipId) {
            return res.status(400).json({
                message: "Internship ID is required"
            });
        }
        const internship = await internshipModel.findById(internshipId);
        if (!internship) {
            return res.status(404).json({
                message: "Internship not found"
            });
        }
        if (internship.companyId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not allowed to view these applicants"
            });
        }
        const applicants = await applicationModel.find({ internshipId }).populate("studentId")
        if (applicants.length === 0) {
            return res.status(404).json({
                message: "No applicants found"
            })
        }
        return res.status(200).json({
            applicants,
            message: "Applicants found successfully"
        })
    }


    catch (err) {
        console.log("getInternshipApplicants error", err)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function changeStatus(req, res) {
    try {

        const applicationId = req.params.applicationId;
        if (!mongoose.Types.ObjectId.isValid(applicationId)) {
            return res.status(400).json({
                message: "Invalid application ID"
            });
        }
        const { status } = req.body
        if (!status) {
            return res.status(400).json({
                message: "Status is required"
            });
        }
        const allowedStatuses = [
            "pending",
            "shortlisted",
            "rejected",
            "accepted"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }
        const application = await applicationModel.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }
        const internship = await internshipModel.findById(
            application.internshipId
        );

        if (!internship) {
            return res.status(404).json({
                message: "Internship not found"
            });
        }

        if (internship.companyId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not allowed to update this application"
            });
        }
        application.status = status;

        await application.save();

        return res.status(200).json({
            application,
            message: "Status updated successfully"
        });


    }
    catch (err) {
        console.log("changeStatus error", err)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }

}

async function getApplicationDetails(req, res) {
    try {
        const applicationId = req.params.applicationId;

        if (!mongoose.Types.ObjectId.isValid(applicationId)) {
            return res.status(400).json({
                message: "Invalid application ID"
            });
        }

        const application = await applicationModel
            .findById(applicationId)
            .populate("studentId", "name email");

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        // Find the internship
        const internship = await internshipModel.findById(
            application.internshipId
        );

        if (!internship) {
            return res.status(404).json({
                message: "Internship not found"
            });
        }

        // Only the company that owns the internship can view
        // the applicant's details
        if (internship.companyId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not allowed to view this applicant"
            });
        }

        // Find student's profile
        const Profile = require("../models/profile.model");

        const profile = await Profile.findOne({
            userId: application.studentId._id
        });

        return res.status(200).json({
            application,
            student: application.studentId,
            profile,
            message: "Applicant details fetched successfully"
        });
    }
    catch (err) {
        console.log("getApplicationDetails error", err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = { createApplication, myApplications, getInternshipApplicants ,changeStatus,getApplicationDetails}