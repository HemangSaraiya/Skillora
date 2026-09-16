const express=require('express')
const profileController=require('../controllers/profile.controller')
const authMiddleware=require('../middlewares/auth.middleware')

const router=express.Router()

router.post('/',authMiddleware.verifyToken,profileController.createProfile)
router.get('/',authMiddleware.verifyToken,profileController.getProfile)
router.patch('/',authMiddleware.verifyToken,profileController.updateProfile)

module.exports=router