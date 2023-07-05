import bcrpyt from "bcryptjs";
import jwt from "jsonwebtoken";
import admin from "../models/admin.model.js";
import teacher from "../models/teacher.model.js";
import student from "../models/student.model.js";
import questions from "../models/questions.model.js";
import test from "../models/test.model.js";

const routes = {};

routes.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await admin.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

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
    const user = await admin.findById(id).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const olduser = await admin.findOne({ email });
    if (olduser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrpyt.hash(password, 12);
    const result = await admin.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: result._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.addteacher = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const olduser = await teacher.findOne({ email });
    if (olduser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrpyt.hash(password, 12);
    const result = await teacher.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ success: "Teacher added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getteachers = async (req, res) => {
  try {
    const teachers = await teacher.find().select("-password");

    res.status(200).json({ teachers });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteteacher = async (req, res) => {
  const id = req.params.id;

  try {
    const deleteques = await questions.deleteMany({ addBy: id });
    const teach = await teacher.findByIdAndDelete(id);
    res.status(200).json({ success: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getquestions = async (req, res) => {
  try {
    const allquestions = await questions.find().populate("addBy", "name");
    res.status(200).json({ allquestions });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deletequestion = async (req, res) => {
  const id = req.params.id;

  try {
    const ques = await questions.findByIdAndDelete(id);
    res.status(200).json({ success: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getusers = async (req, res) => {
  try {
    const users = await student.find().select("-password");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteuser = async (req, res) => {
  const id = req.params.id;

  try {
    const tes = await test.findOneAndDelete({ student: id });
    const user = await student.findByIdAndDelete(id);
    res.status(200).json({ success: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.deleteunpaid = async (req, res) => {
  try {
    const user = await student.deleteMany({ isPaid: false });
    res.status(200).json({ success: "Unpaid users deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// routes.getuser = async (req, res) => {
//   const id = req.params.id;

//   try {
//     const user = await user.findById(id).select("-password").populate("test");
//     res.status(200).json({ user });
//   } catch (error) {
//     res.status(500).json({ error: "Something went wrong" });
//   }
// };

routes.getscores = async (req, res) => {
  try {
    const users = await student
      .find({ isExamGiven: true })
      .select("-password")
      .populate("test", "score currentQuestion currentTimer")
      // .sort({ score: -1 });

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default routes;
