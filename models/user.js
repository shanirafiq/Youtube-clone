const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const bcript=require("bcryptjs");


const userSchema=new mongoose.Schema({
userName:{
    type:String,
    required:true,
    index:true,
},
email:{
    type:String,
    required:true,
},
fullName:{
    type:String,
    required:true,
    index:true,
},
avatar:{
    type:String, 
    required:true// cloudanary service
},
coverImage:{
    type:String,
},
watchHistory:[
{

    type:mongoose.Schema.Types.ObjectId,
    ref:"Vidio"
}
],
password:{
    type:String,
    require:[true,"password must required"],
},
refreshToken: {
    type: String, // Store refresh token in database
  },
},{
    timestamps:true
});



userSchema.pre("save", async function(next) {
    // Check if the password field has been modified
    if (!this.isModified("password")) return next();
    
    // Hash the password
    this.password = await bcript.hash(this.password, 10);
    next();
});
userSchema.methods.isPasswordCorrect=async function(password){
return await bcript.compare(password,this.password);
};

userSchema.methods.generateToken=async function(){
  return jwt.sign({
   _id:this._id,
    email:this.email,
    userName:this.userName,
    fullName:this.fullName,

},process.env.jwt_token,{expiresIn:process.env.jwt_expiry})
}
userSchema.methods.generateRefreshToken =async function(){
    return jwt.sign({
        _id:this._id,
    
    },process.env.1,{expiresIn:process.env.refresh_token_expiry})
}
const User = mongoose.model("User", userSchema);
module.exports=User;