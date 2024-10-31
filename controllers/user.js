const mongoose = require("mongoose");
const User = require("../models/user");
const cloudinary = require("../utitity/Cloudnary");
const bcript=require("bcryptjs");
const Subctrbe=require("../models/subcribe");




const register = async (req, res) => {
  const { userName, email, fullName, password } = req.body;

  try {
    // Validate required fields
    if (!userName || !email || !fullName || !password) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    }
    const userExist=await User.findOne({$or:[{userName},{email}]});
    console.log("userexist",userExist);
    if(userExist){
      res.status(400).json({msg:"user Already exist"})
    }

    // Check if files were uploaded properly
    if (!req.files || !req.files.avatar || !req.files.coverImage) {
      return res.status(400).json({ msg: "Please upload both avatar and cover image" });
    }

    // Extract file information from the uploaded files
    const avatar = req.files.avatar?.[0].path;
    const coverImage = req.files.coverImage?.[0].path;

    // Upload avatar and coverImage to Cloudinary
    const avatarImage = await cloudinary.uploader.upload(avatar);
    const coverImageFile = await cloudinary.uploader.upload(coverImage);

    // Generate URLs for the uploaded images
    const avatarUrl = avatarImage.secure_url;
    const coverImageUrl = coverImageFile.secure_url;

    // Create a new user with the uploaded image URLs
    const newUser = await User.create({
      userName,
      email,
      fullName,
      password,
      avatar: avatarUrl, // Storing avatar URL
      coverImage: coverImageUrl, // Storing cover image URL
    });
 

    // Respond with success and user data
    res.status(200).json({ msg: "User registered successfully", data: newUser });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordCorrect = await bcript.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ msg: "Password is incorrect" });
    }

    // Generate access token
    const token = await user.generateToken();

    // Generate refresh token
    const refreshToken = await user.generateRefreshToken();

    // Save the refresh token in the user's document
    user.refreshToken = refreshToken;
    await user.save();

    // Send the access and refresh tokens in the response
    res.status(200).json({
      msg: "Login successful",
      token, // Access token
      refreshToken // Refresh token
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const updatePassword=async(req,res)=>{
const {newPassword,confirmPassword}=req.body;
try{
 if(newPassword!==confirmPassword){
  res.status(400).json({msg:"password not match"});
 }
  const userId = await User.findOne();
  console.log("userid",userId)

  if(!userId){
    res.status(400).json({msg:"user not found"})
  }
  userId.password=newPassword;
  res.status(200).json({msg:"successfully updated password"})
}
catch(err){
  res.status(500).json({msg:"internal server error",err})
}
}

const updateuser = async (req, res) => {
  const { email, userName } = req.body;

  try {
    // Check if email, username, and file are provided
    if (!email || !userName || !req.file) {
      return res.status(400).json({ msg: "Email, username, and avatar are required" });
    }

    // Access the uploaded avatar image file
    const avatarPath = req.file.path;
    console.log("Avatar path:", avatarPath);

    // Upload the image to Cloudinary
    const avatarImage = await cloudinary.uploader.upload(avatarPath);
    if (!avatarImage) {
      return res.status(400).json({ msg: "Image not uploaded" });
    }

    console.log("Uploaded avatar:", avatarImage);

    // Find the user (you should use the correct method to identify the user)
    const userId =  await User.findOne() // Use correct logic based on authentication
    if (!userId) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update the user with the new avatar, email, and username
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          email,
          userName,
          avatar: avatarImage.url, // Update avatar URL in the schema
        },
      },
      { new: true } // Return the updated document
    ).select('-coverImage -password'); // Exclude coverImage and password from the response

    console.log("Updated user:", updatedUser);
    res.status(200).json({ msg: "Updated username, email, or avatar", updated: updatedUser });

  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ msg: "Internal server error", err });
  }
};
const channal=async(req,res)=>{
  try{
    const {userName}=req.params;
    if(!userName){
      res.status(400).json({msg:"user not found"})
    }
    const channal = await User.aggregate([
      {
        $match: {
          userName: userName,
        },
      },
      {
        $lookup: {
          from: "subscribes",
          localField: "_id",
          foreignField: "channal",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "subscribes",
          localField: "_id",
          foreignField: "Subctrber",
          as: "subscribeTo",
        },
      },
      {
        $addFields: {
          subscribersCount: {
            $size: "$subscribers",
          },
          subscriberCountTo: {
            $size: "$subscribeTo",
          },
          isSubscribe: {
            $cond: {
              if: { $in: [req.user?._id, "$subscribers.Subctrber"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          userName: 1,
          email: 1,
          fullName: 1,
          subscribersCount: 1,
          subscriberCountTo: 1,
          isSubscribe: 1, // Fixed 'isSubscribe' projection
        },
      },
    ]);
    console.log(channal)
    res.status(200).json({msg:channal[0]})
    
    
  }
  catch(err){
    res.status(500).json({msg:"internal server error",err})
  }

}
module.exports = { register ,login,updatePassword,updateuser};
