const {user} = require('../models/userSchema')
const jwt = require("jsonwebtoken");
const handleUserRegister = async(req,res) => {
    const email = req.body?.email;
    try{
        const isUser = await user.findOne({email});
        if(!isUser){
            await user.insertOne({email : email});
        }
        const token = jwt.sign({email},'SECRET_KEY');
        console.log(token);
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });
        
    }
    catch(err){
        return res.send(500).json({error : "Error in saving email"});
    }
    return res.status(200).json({ status : "Saved Successfully"});
}

module.exports = {
    handleUserRegister
}