const mongoose=require('mongoose')

const internshipSchema=new mongoose.Schema({
    companyId:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    domain:{
        type: String,
        required:true
    },
    requiredSkills:{
       type: [String],
       required:true
    },
    preferredSkills:
    {
        type: [String],
        default:[]
    },
    location:{
        type:String
    },
    workMode:{
        type: String,
    enum: ["remote", "hybrid", "onsite"],
    required: true
    },
    duration:{
        value:Number,
        unit:{
            type:String,
            enum:["weeks","months"]
        }
    },
    stipend:{
        amount:Number,
        currency:{
            type:String,
            default:"INR"
        },
        period:{
            type:String,
            enum:["monthly","total","unpaid"]
        }
    },
    applicationDeadline:{
        type:Date,
        required:true
    },
    eligibility:{
        minYear:Number,
        maxYear:Number,
        minimumCGPA:Number
    },
    status:{
        type: String,
        enum: ["draft", "active", "closed"],
        default: "draft"
    },

},{
    timestamps:true,
})

module.exports= mongoose.model("Internship",internshipSchema)