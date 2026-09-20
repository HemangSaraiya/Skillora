const internshipModel = require("../models/internship.model");
const mongoose = require("mongoose");
const applicationModel = require("../models/application.model")

async function createInternship(req, res) {
    try {
        const companyId = req.user.id
        const {
            title,
            description,
            domain,
            requiredSkills,
            preferredSkills,
            location,
            workMode,
            duration,
            stipend,
            applicationDeadline,
            eligibility,
            status
        } = req.body
        const internship = await internshipModel.create({
            companyId,
            title,
            description,
            domain,
            requiredSkills,
            preferredSkills,
            location,
            workMode,
            duration,
            stipend,
            applicationDeadline,
            eligibility,
            status
        })
        return res.status(201).json({
            internship,
            message: "Internship created successfully"
        });
    }
    catch (err) {
        console.log("error in createInternship:", err);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function getAllInternship(req, res) {
    try {
        const internships = await internshipModel.find({ status: "active" })
        if (internships.length === 0) {
            return res.status(200).json({
                internships: [],
                message: "No internships available"
            });
        }
        return res.status(200).json({
            internships,
            message: "Internship fetched successfully"
        })
    }
    catch (err) {
        console.log("error in getAllInternship:", err);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function getMyInternships(req, res) {
    try {
        const companyId = req.user.id;

        const internships = await internshipModel.find({
            companyId
        });

        if (internships.length === 0) {
            return res.status(200).json({
                internships: [],
                message: "No internships found"
            });
        }

        return res.status(200).json({
            internships,
            message: "My internships fetched successfully"
        });
    }
    catch (err) {
        console.log("error in getMyInternships:", err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function getInternship(req, res) {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid internship ID"
            });
        }
        const internship = await internshipModel.findById(id);

        if (!internship) {
            return res.status(404).json({
                message: "Internship not found"
            });
        }
        return res.status(200).json({
            internship,
            message: "Internship found successfully"
        })
    }
    catch (err) {
        console.log("error in getInternship", err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function updateInternship(req, res) {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid internship ID"
            });
        }

        const internship = await internshipModel.findById(id);

        if (!internship) {
            return res.status(404).json({
                message: "Internship not found"
            });
        }

        if (internship.companyId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not allowed to update this internship"
            });
        }
        const {
            title,
            description,
            domain,
            requiredSkills,
            preferredSkills,
            location,
            workMode,
            duration,
            stipend,
            applicationDeadline,
            eligibility,
            status
        } = req.body
        const updates = {}
        if (title !== undefined) {
            updates.title = title
        }
        if (description !== undefined) {
            updates.description = description
        }
        if (domain !== undefined) {
            updates.domain = domain
        }
        if (requiredSkills !== undefined) {
            updates.requiredSkills = requiredSkills
        }
        if (preferredSkills !== undefined) {
            updates.preferredSkills = preferredSkills
        }
        if (location !== undefined) {
            updates.location = location
        }
        if (workMode !== undefined) {
            updates.workMode = workMode
        }
        if (duration !== undefined) {
            updates.duration = duration
        }
        if (eligibility !== undefined) {
            updates.eligibility = eligibility
        }
        if (stipend !== undefined) {
            updates.stipend = stipend
        }
        if (applicationDeadline !== undefined) {
            updates.applicationDeadline = applicationDeadline
        }
        if (status !== undefined) {
            updates.status = status
        }
        const updatedInternship = await internshipModel.findByIdAndUpdate(
            id,
            { $set: updates },
            {
                returnDocument: "after",
                runValidators: true
            }
        )

        return res.status(200).json({
            updatedInternship,
            message: "Internship updated successfully"
        })
    }
    catch (err) {
        console.log("error in updateInternship", err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function deleteInternship(req, res) {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid internship ID"
            });
        }

        const internship = await internshipModel.findById(id);

        if (!internship) {
            return res.status(404).json({
                message: "Internship not found"
            });
        }

        if (internship.companyId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not allowed to delete this internship"
            });
        }
        const activeApplication = await applicationModel.findOne({
            internshipId: id,
            status: { $ne: "rejected" }
        });

        if (activeApplication) {
            return res.status(400).json({
                message: "Cannot delete internship while there are active applications"
            });
        }
        await internshipModel.findByIdAndDelete(id)
        return res.status(200).json({
            message: "Internship deleted successfully"
        })
    }
    catch (err) {
        console.log("error in deleteInternship", err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = {
    createInternship,
    getAllInternship,
    getMyInternships,
    getInternship,
    updateInternship,
    deleteInternship
}