const mongoose = require("mongoose");
const messageModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    content:{
        type:String,
        trim:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }}
    ,
    {
        timeStamps:true
    

  });

const Message = mongoose.model("Message", messageModel);
module.exports = Message;
