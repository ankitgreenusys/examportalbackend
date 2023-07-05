import express from "express";
import adminController from "../controllers/admin.controllers.js";
import adminauth from "../middlewares/admin.auth.js";

const router = express.Router();

/* 
getquestions
deletequestion
getusers
getuser
getscores

 */

router.post("/login", adminController.login);
router.get("/getprofile", adminauth, adminController.getdta)
router.post("/register", adminController.register);
router.post("/addteacher", adminauth, adminController.addteacher);
router.get("/getteachers", adminauth, adminController.getteachers);
router.delete("/deleteteacher/:id", adminauth, adminController.deleteteacher);
router.get("/getquestions", adminauth, adminController.getquestions);
router.delete("/deletequestion/:id", adminauth, adminController.deletequestion);
router.get("/getusers", adminauth, adminController.getusers);
router.delete("/deleteuser/:id", adminauth, adminController.deleteuser);
router.delete("deleteunpaid", adminauth, adminController.deleteunpaid)
// router.get("/getuser/:id", adminauth, adminController.getuser);
router.get("/getscores", adminauth, adminController.getscores);

export default router;
