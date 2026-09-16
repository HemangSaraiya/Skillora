const express = require("express");

const recommendationController = require("../controllers/recommendation.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const router = express.Router();

router.get(
    "/",
    authMiddleware.verifyToken,
    roleMiddleware.roleMiddleware(["student"]),
    recommendationController.recommendation
);

module.exports = router;