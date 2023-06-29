import bcrpyt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendOTP from "../utils/sendOTP.utils.js";
import student from "../models/student.model.js";
import questions from "../models/questions.model.js";
import test from "../models/test.model.js";

const routes = {};

routes.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await student.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrpyt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(400).json({ error: "User not verified" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ result: user._id, token });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.signup = async (req, res) => {
  const {
    name,
    email,
    password,
    phoneNumber,
    addharNumber,
    yearOfPassing,
    itiTrade,
  } = req.body;

  // 6 digit otp
  const otp = Math.floor(100000 + Math.random() * 900000);
  const exp = new Date().getTime() + 10 * 60 * 1000;

  const salt = await bcrpyt.genSalt(10);
  const hashedPassword = await bcrpyt.hash(password, salt);

  const dta = {
    name,
    email,
    password: hashedPassword,
    phoneNumber,
    addharNumber,
    yearOfPassing,
    itiTrade,
    otp,
    otpExpiresIn: exp,
  };

  // try {
  const user = await student.findOne({ email });
  if (user && user.isVerified)
    return res.status(400).json({ error: "User already exists" });

  if (user) {
    student.deleteOne({ email });
  }

  //check addhar number and phonenumber is unique

  const useradd = await student.findOne({ addharNumber });
  if (useradd)
    return res.status(400).json({ error: "Addhar number already exists" });

  const userph = await student.findOne({ phoneNumber });
  if (userph)
    return res.status(400).json({ error: "Phone number already exists" });

  const resmail = await sendOTP(email, otp, "One Time Password");
  if (!resmail.messageId)
    return res.status(500).json({ error: "Something went wrong with OTP" });

  // console.log(dta);
  const newUser = await student.create(dta);
  if (!newUser) return res.status(500).json({ error: "Something went wrong" });

  res.status(200).json({ userId: newUser._id, success: "OTP sent" });
  // } catch (error) {
  //   res.status(500).json({ error: "Something went wrong" });
  // }
};

routes.verifyotp = async (req, res) => {
  const id = req.params.id;
  const { email, otp } = req.body;

  try {
    const user = await student.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.email != email)
      return res.status(400).json({ error: "Invalid credentials" });

    const timeno = new Date().getTime();
    if (user.otpExpiresIn < timeno)
      return res.status(400).json({ error: "OTP expired" });

    if (user.otp != otp) return res.status(400).json({ error: "Invalid OTP" });

    if (user.isVerified)
      return res.status(400).json({ error: "User already verified" });

    const updt = await student.findByIdAndUpdate(id, { isVerified: true });
    if (!updt) return res.status(404).json({ error: "User not found" });

    res.status(200).json({
      id: user._id,
      success: "User verified",
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.sendpaymentlink = async (req, res) => {
  res.status(200).json({ success: "Payment link sent" });
};

routes.checkpayment = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await student.findById(id);
    const ques = await questions
      .find({ itiTrade: user.itiTrade })
      .select("_id");

    const shuffled = ques.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 20);

    const testdata = await test.create({
      questions: selected,
      student: id,
      currentTimer: 20 * 60,
    });

    user.test = testdata._id;
    user.isPaid = true;

    await user.save();

    res.status(200).json({ success: "Payment verified" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getdta = async (req, res) => {
  const id = req.userId;

  try {
    const user = await student
      .findById(id)
      .select("-password -otp -otpExpiresIn");

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getquestion = async (req, res) => {
  const studentid = req.userId;

  try {
    const testdata = await test
      .findOne({ student: studentid })
      .select("questions currentQuestion isCompleted");

    if (!testdata) return res.status(404).json({ error: "Test not found" });

    if (testdata.isCompleted)
      return res.status(400).json({ error: "Test completed" });

    const currentQuestionId = testdata.questions[testdata.currentQuestion];

    const question = await questions.findById(currentQuestionId);

    const dta = {
      questionno: testdata.currentQuestion + 1,
      question: question.question,
      option1: question.option1,
      option2: question.option2,
      option3: question.option3,
      option4: question.option4,
    };

    res.status(200).json(dta);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.submitanswer = async (req, res) => {
  const id = req.userId;
  const { answer } = req.body;

  try {
    const user = await student.findById(id).select("test isExamGiven");
    const testdata = await test
      .findById(user.test)
      .select("questions currentQuestion answers score isCompleted");

    if (testdata.isCompleted)
      return res.status(400).json({ error: "Test completed" });

    const currentQuestionid = testdata.questions[testdata.currentQuestion];

    const question = await questions.findById(currentQuestionid);

    if (question.answer == answer) testdata.score += 1;
    else if (answer == "skip") testdata.score += 0;
    else testdata.score -= 0.25;

    testdata.answers[testdata.currentQuestion] = answer;

    testdata.currentQuestion += 1;

    if (testdata.currentQuestion == 20) {
      testdata.isCompleted = true;
      user.isExamGiven = true;
    }

    await testdata.save();
    await user.save();

    res.status(200).json({ success: "Answer submitted" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.changeTimer = async (req, res) => {
  const id = req.userId;

  try {
    const user = await student.findById(id).select("test isExamGiven");
    const testdata = await test
      .findById(user.test)
      .select("currentTimer isCompleted");

      // console.log(req.body.currentTimer)

    testdata.currentTimer = req.body.currentTimer;

    if (testdata.currentTimer == 0) {
      testdata.isCompleted = true;
      user.isExamGiven = true;
    }

    await testdata.save();

    res.status(200).json({ success: "Timer changed" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getTimer = async (req, res) => {
  const student = req.userId;

  try {
    const testdata = await test.findOne({ student }).select("currentTimer");
    res.status(200).json({ currentTimer: testdata.currentTimer });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

routes.getEndExam = async (req, res) => {
  const id = req.userId;

  // try {
  const user = await student.findById(id).select("test isExamGiven");
  const testdata = await test.findById(user.test).select("answers");

  if (!user.isExamGiven)
    return res.status(400).json({ error: "Exam not given" });

  const dta = {
    answered: 0,
    unanswered: 0,
  };

  for (let i = 0; i < 20; i++) {
    if (testdata.answers[i] != "skip") dta.answered += 1;
    else dta.unanswered += 1;
  }

  res.status(200).json({ dta });
  // } catch (error) {
  //   res.status(500).json({ error: "Something went wrong" });
  // }
};

export default routes;
