const mongoose=require("mongoose");

const subcribeSchema=new mongoose.Schema({
    Subctrber:{
        type:mongoose.Schema.Types.ObjectId, // who is subscibibg
        ref:"User",
    },
    channal:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User" // subscriber who has chanal
    },

},{timestamps:true});
const Subctrbe=new mongoose.model("Subscribe",subcribeSchema);
module.exports=Subctrbe;