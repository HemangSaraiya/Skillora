const roleMiddleware=(allowedRoles)=>{
    return (req,res,next)=>{
        try{
        const role=req.user.role

            if(allowedRoles.includes(role)){
                next()
            }
            else{
                return res.status(403).json({
                    messsge:"Access Denied"
                })
            }
        }
        catch(err){
            console.log("error in role:",err);
            return res.status(500).json({
                message:"Internal Server Error"
            })
        }
        }
}

module.exports={roleMiddleware}