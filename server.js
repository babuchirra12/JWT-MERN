const express = require("express");
const mongoose = require("mongoose");
const cors= require('cors')
const Registeruser = require("./model");
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");
const middleware = require("./middleware");
const app = express();

mongoose
  .connect(
    "mongodb+srv://babuchirra:babuchirra@cluster0.qsn13.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB Connected"));

app.use(express.json());

app.use(cors({origin:"*"}))
app.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmpassword } = req.body;
    let exist = await Registeruser.findOne({ email: email });
    if (exist) {
      return res.status(400).send("User Already Exist");
    }
    if (password !== confirmpassword) {
      return res.status(400).send("password are not matching");
    }
    let newUser = new Registeruser({
      username,
      email,
      password,
      confirmpassword,
    });
    await newUser.save();
    res.status(200).send("Registeruser Successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Intenal Server Error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let exist = await Registeruser.findOne({ email });
    if (!exist) {
      return res.status(400).send("User Not Found");
    }
    if (exist.password !== password) {
      return res.status(400).send("Invalid Credentials");
    }
    let payload = {
      user: {
        id: exist.id,
      },
    };
    jwt.sign(payload, "jwtSecret", { expiresIn: 3600000 }, (err, token) => {
      if (err) throw err;
      return res.json({ token });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Sever Error");
  }
});

app.get("/myprofile", middleware, async(req, res) => {
  try {
    let exist = await Registeruser.findById(req.user.id);
    if (!exist) {
      return res.status(400).send("User Not found");
    }
    res.json(exist);
  } catch (err) {
    console.log(err);
    return res.status(500).st;
  }
});
app.listen(5000, () => {
  console.log("Server running ...");
});

//https://localhost:5000/
