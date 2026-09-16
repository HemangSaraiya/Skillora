const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    education: {
        degree: String,
        field: String,
        university: String,
        graduationYear: Number
    },
    currentYear: {
        type: Number,
        required: true
    },

    cgpa: {
        type: Number,
        required: true
    },
    skills: {
        type: [String],
        default: []
    },
    projects: [{
        title: String,
        description: String,
        technologies: [String],
        githubUrl: String,
        liveUrl: String

    }],
    experience: [{
        title: String,
        organization: String,
        description: String,
        startDate: Date,
        endDate: Date
    }],
    preferredDomains: {
        type: [String],
        default: []
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model("Profile", profileSchema)