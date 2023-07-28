const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body,  validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt =require("jsonwebtoken");

const fetchuser= require("../middleware/fetchuser");

const JWT_SECRET= "harry is a good boy";

// Route 1 : Create a user using Post "/api/auth/createUser". No login required
router.post(
  "/createUser",
  [
    body("name", " name is less than 3").isLength({ min: 3 }),
    body("email", "not a valid email").isEmail(),
    body("password", "not a valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // console.log(req.body);
    let success=false;

    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ success,errors });
    //findOne is async func
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(400)
        .json({success, error: "Sorry a user with this email already exists!!" });

    try {

        const salt= await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password,salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });
      const data ={
        user :{ 
            id: user._id
        }
      };
      const authToken=  jwt.sign(data, JWT_SECRET);
      // console.log(authToken);
      success=true;
      res.json({success,authToken});
    } catch (error) {
      console.error(error);
      res.status(500).send({success,error:"Internal Server Error"});
    }
    // User.create({
    //     name : req.body.name,
    //     email: req.body.email,
    //     password : req.body.password
    // }).then(user =>res.json(user))
    // .catch(err=> {console.log(err)
    //  res.json({error : "Please enter a unique email", message : err.message})}
    // );

    // const user= User(req.body);
    // user.save();
    // res.send(req.body);
  }
);

// Route 2 : Login a user using Post "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success=false;

    const errors = validationResult(req);

    if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
    const {email, password} =req.body;
    try {
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({success,error : "Please login with correct credentials." });
      }
      let passwordCompare=await bcrypt.compare(password, user.password);
      if(!passwordCompare)
      return res.status(400).json({success,error : "Please login with correct credentials." });

      const data = {
        user :{ 
            id: user._id
        }
      };
      const authToken=  jwt.sign(data, JWT_SECRET);
      // console.log(authToken)
      success=true;
      res.json({success,authToken});

    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
)
// Route 3 : get user data using Post "/api/auth/getuser". Login required
router.post(
  "/getuser",
  fetchuser,
  // it is a middleware fuction called each time when route /getuser got hit
  async (req, res) => {
    try {
      const userId= req.user.id;
      const user =  await User.findById(userId).select("-password");
      res.send(user);
      
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  })
module.exports = router;
