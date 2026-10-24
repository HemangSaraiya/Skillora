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

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
async function getAllInternship(req, res) {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(
            50,
            Math.max(1, Number(req.query.limit) || 9)
        );

        const skip = (page - 1) * limit;

        const { search, domain, workMode, sortBy } = req.query;

const filter = { status: "active" };



if (workMode && workMode !== "all") {
  filter.workMode = workMode;
}
if (search && search.trim()) {
    const searchRegex = new RegExp(escapeRegex(search.trim()),
        "i");

    filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { domain: searchRegex },
        { location: searchRegex },
        { requiredSkills: searchRegex },
        { preferredSkills: searchRegex }
    ];
}
        const totalInternships =
            await internshipModel.countDocuments(filter);

        const totalPages = Math.ceil(totalInternships / limit);
        let sortOption = { createdAt: -1 };

switch (sortBy) {
    case "oldest":
        sortOption = { createdAt: 1 };
        break;

    case "title-asc":
        sortOption = { title: 1 };
        break;

    case "stipend-high":
        sortOption = { "stipend.amount": -1 };
        break;

    case "stipend-low":
        sortOption = { "stipend.amount": 1 };
        break;

    case "newest":
    default:
        sortOption = { createdAt: -1 };
}
        const internships = await internshipModel
            .find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            internships,
            pagination: {
                currentPage: page,
                limit,
                totalInternships,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            },
            message: internships.length === 0
                ? "No internships available"
                : "Internship fetched successfully"
        });
    } catch (err) {
        console.log("error in getAllInternship:", err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
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

async function getCompanyStats(req, res) {
    try {
        const companyId = req.user.id;

        // Get all internships posted by this company
        const internshipIds = await internshipModel.distinct("_id", {
            companyId
        });

        // Calculate statistics
        const [
            activeInternships,
            totalApplications,
            pendingApplications
        ] = await Promise.all([
            internshipModel.countDocuments({
                companyId,
                status: "active"
            }),

            applicationModel.countDocuments({
                internshipId: { $in: internshipIds }
            }),

            applicationModel.countDocuments({
                internshipId: { $in: internshipIds },
                status: "pending"
            })
        ]);

        return res.status(200).json({
            stats: {
                totalInternships: internshipIds.length,
                activeInternships,
                totalApplications,
                pendingApplications
            },
            message: "Company statistics fetched successfully"
        });
    }
    catch (err) {
        console.log("error in getCompanyStats:", err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    createInternship,
    getAllInternship,
    getMyInternships,
    getInternship,
    updateInternship,
    deleteInternship,
    getCompanyStats
}