const express = require("express");
const Logger = require("../util/logger.js");
const router = express.Router();
const InvalidError = require("../error/invalidError.js");
const User = require("./user/service/user.js");
const bcrypt = require("bcrypt");
const {Payload} = require("../middleware/authentication.js");
const NotFoundError = require("../error/notFoundError.js");
const cookieParser = require('cookie-parser');
const userRouter = require("./user");
router.post("/createAdmin", async (req, res, next) => {
    try {
        const { firstName, lastName, username, password } = req.body;

        // Validate inputs
        if (!firstName || typeof firstName !== "string") {
            throw new InvalidError("Invalid first name");
        }
        if (!lastName || typeof lastName !== "string") {
            throw new InvalidError("Invalid last name");
        }
        if (!username || typeof username !== "string") {
            throw new InvalidError("Invalid username");
        }
        if (!password || typeof password !== "string") {
            throw new InvalidError("Invalid password");
        }

         
        const existingUser = await User.getUserByUsername(username);  
        if (existingUser) {
            throw new InvalidError("This username already exists");
        }

        const admin = await User.newAdmin(firstName, lastName, username, password);
        if(!admin)
            throw new InvalidError("could not create admin");
        return res.status(201).json(admin);  
    } catch (error) {
        
         next(error);
    }
});


router.post("/login",async(req,res,next)=> {
    try{
      const {username,password} = req.body;
      if(!username)
        throw new InvalidError("Invalid username");
    if(!password)
        throw new InvalidError("invalid password");

    const user = await User.getUserByUsername(username);

    if(!user)
        throw new InvalidError("user does not exist");

     // changes making
    
    if(await bcrypt.compare(password,user.getPassword())){
       
       const payload = new Payload(user.getUserID(),user.getIsAdmin());

       const token = payload.signPayload();
       res.cookie("auth", `Bearer ${token}`);
       res.set("auth", `Bearer ${token}`);
   
        return res.status(200).send(token);

    }
    else{
        res.status(403).json({ error: "incorrect password entered" });
    }


    }
    catch(error){
        next(error);
    }
})


router.use("/user",userRouter);



module.exports = router;