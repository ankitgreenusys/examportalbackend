import bcrpyt from "bcryptjs";
import jwt from "jsonwebtoken";
import teacher from "../models/teacher.model.js";
import questions from "../models/questions.model.js";

const routes = {};

routes.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await teacher.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrpyt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ result: user, token });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getdta = async (req, res) => {
  const id = req.userId;
  try {
    const user = await teacher.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.addquestion = async (req, res) => {
  const {
    question,
    img,
    option1,
    option2,
    option3,
    option4,
    answer,
    itiTrade,
  } = req.body;

  const dta = {
    question,
    option1,
    option2,
    option3,
    option4,
    answer,
    itiTrade,
    addBy: req.userId,
  };

  if (!img) {
    dta.img = "";
  } else {
    dta.img = img;
  }
  try {
    const result = await questions.create(dta);
    res.status(201).json({success: "Question Added Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
