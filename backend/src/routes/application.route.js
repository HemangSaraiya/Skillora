const express=require('express')
const applicationController=require('../controllers/application.controller')
const authMiddleware=require('../middlewares/auth.middleware')
const roleMiddleware=require('../middlewares/role.middleware')

const router=express.Router()

router.post('/',authMiddleware.verifyToken,roleMiddleware.roleMiddleware(["student"]),applicationController.createApplication)
router.get('/my-applications',authMiddleware.verifyToken,roleMiddleware.roleMiddleware(['student']),applicationController.myApplications)
router.get('/internship/:internshipId',authMiddleware.verifyToken,roleMiddleware.roleMiddleware(["company","admin"]),applicationController.getInternshipApplicants)
router.patch('/:applicationId/status',authMiddleware.verifyToken,roleMiddleware.roleMiddleware(["company","admin"]),applicationController.changeStatus)
router.get(
    "/:applicationId/details",
    authMiddleware.verifyToken,
    roleMiddleware.roleMiddleware(["company"]),
    applicationController.getApplicationDetails
);
module.exports=router