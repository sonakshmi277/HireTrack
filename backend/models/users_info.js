const mongoose=require("mongoose");
const users_infoSchema=new mongoose.Schema(
    {
        Name:{type:String,required:true},
        Email:{type:String,required:true},
        Age:{type:Number,required:true},
        Education:{type:String,required:true},
        JobType:{type:String,required:true},
        Resume:{type:String,required:true},
    },
    {
        timestamps:true
    }

);

const UserInfo=mongoose.model("userinfo",users_infoSchema);
module.exports=UserInfo;