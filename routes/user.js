const { register,login,updatePassword ,updateuser} = require("../controllers/user");
const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/multer");

// Route for user registration and file upload
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },     // Avatar upload field
    { name: "coverImage", maxCount: 1 }, // Cover image upload field
  ]),
  register
);
router.route("/login").post(login);
router.route("/updatepassword").put(updatePassword);
router.route("/updateuser").put(upload.single("avatar"),updateuser);

module.exports = router;
