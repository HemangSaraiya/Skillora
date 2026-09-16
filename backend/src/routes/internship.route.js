const express=require('express')
const internshipController=require('../controllers/internship.controller')
const authMiddleware=require('../middlewares/auth.middleware')
const roleMiddleware=require('../middlewares/role.middleware')

const router=express.Router()

router.post('/',authMiddleware.verifyToken,roleMiddleware.roleMiddleware(["company","admin"]),internshipController.createInternship)
router.get("/", internshipController.getAllInternship);
router.get('/:id',internshipController.getInternship)
router.patch('/:id',authMiddleware.verifyToken,roleMiddleware.roleMiddleware(["company"]),internshipController.updateInternship)
router.delete('/:id',authMiddleware.verifyToken,roleMiddleware.roleMiddleware(["company"]),internshipController.deleteInternship)


module.exports=router;