const express = require("express");
const { body } = require("express-validator");
const { login, me, signup } = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");
const { handleValidation } = require("../middleware/validationMiddleware");

const router = express.Router();

router.post("/signup", [body("name").trim().notEmpty(), body("email").isEmail(), body("password").isLength({ min: 6 }), body("role").isIn(["patient", "doctor", "family"])], handleValidation, signup);
router.post("/login", [body("email").isEmail(), body("password").notEmpty()], handleValidation, login);
router.get("/me", requireAuth, me);

module.exports = router;