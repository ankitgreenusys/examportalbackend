import jwt from "jsonwebtoken";
import teacher from "../models/teacher.model.js";
import mongoose from "mongoose";

const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) return res.status(401).send("Unauthorized");

    const token = req.headers.authorization.split(" ")[1];

    if (token) {
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      const id = decodedData?.id;
      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).json({ error: "No user with that id" });

      const user = await teacher.findById(id);
      if (!user) return res.status(404).json({ error: "User not found" });

      req.userId = id;
      next();
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default auth;
