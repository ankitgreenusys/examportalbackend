import express from "express";
import studentController from "../controllers/student.controllers.js";
import studentauth from "../middlewares/student.auth.js";

const router = express.Router();

router.post("/login", studentController.login);
router.post("/signup", studentController.signup);
router.post("/verifyotp/:id", studentController.verifyotp);
router.get("/sendpaymentlink/:id", studentController.sendpaymentlink);
router.get("/checkpayment/:id", studentController.checkpayment);
router.get("/getprofile", studentauth, studentController.getdta);
router.get("/getquestion", studentauth, studentController.getquestion);
router.post("/submitanswer", studentauth, studentController.submitanswer);
router.post("/changeTimer", studentauth, studentController.changeTimer);
router.get("/gettimer", studentauth, studentController.getTimer);
router.get("/getEndExam", studentauth, studentController.getEndExam);

export default router;
