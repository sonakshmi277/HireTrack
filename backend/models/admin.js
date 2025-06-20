const mongoose = require("mongoose");
const adminSchema=new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true
        },
        fullName:{
            type:String,
            required:true
        },
        profilePic:{
            type:String,
            default:""
        }
    }
    ,
        {timestamps:true}
);
const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;

