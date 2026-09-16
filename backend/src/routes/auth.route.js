const express=require('express')
const authController=require('../controllers/auth.controller')
const authMiddleware=require('../middlewares/auth.middleware')

const router=express.Router()

router.post('/register',authController.registration);
router.post('/login',authController.login)
router.get("/me", authMiddleware.verifyToken, authController.getMe);
router.post('/logout',authController.logout)

module.exports=router