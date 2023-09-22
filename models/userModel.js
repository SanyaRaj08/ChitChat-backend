const mongoose = require("mongoose");
const userModel = mongoose.Schema(
  {
    name: { type: String, required:true },
    password: { type: String, required:true },
    email: { type: String, required:true,
      unique:true },
    pic: { type: String, default:"https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-profile-line-black-icon-png-image_691065.jpg"},
}
    ,
    {
        timeStamps:true
    

  });

const User = mongoose.model("User", userModel);
module.exports = User;