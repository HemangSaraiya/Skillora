const mongoose =require('mongoose')

const applicationSchema=new mongoose.Schema({
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    internshipId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Internship",
        required:true
    },
    coverLetter:{
        type:String,
        trim:true
    },
    status:{
        type:String,
        enum:["pending","shortlisted","rejected","accepted"],
        default:"pending"
    },
    
},{
    timestamps:true
})

applicationSchema.index(
    {studentId:1,internshipId:1},
    {unique:true}
)

module.exports=mongoose.model("Application",applicationSchema)
