const mongoose=require("mongoose");
const mongooseAggregatePaginate=require("mongoose-aggregate-paginate-v2");
const vidioSchema=new mongoose.Schema({
    vidioFile:{
        type:String, // cloudanary
        required:true, 
    },
thumbnail:{
    type:String,
    required:true,
},
owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
},
title:{
    type:String,
    required:true,
},
description:{
    type:String,
    required:true,
},
duration:{
    type:Number, // cloudnary
    required:true,
},
views:{
    type:Number,
    default:0,
},
isPublish:{
    type:Boolean,
    default:true,
},



},{
    timestamps:true,
})
 vidioSchema.plugin("mongooseAggregatePaginate");
const vidio=new mongoose.model("Vidio",vidioSchema);

module.exports=vidio;