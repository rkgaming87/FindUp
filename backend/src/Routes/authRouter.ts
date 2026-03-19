import { signUp, login, logout } from "@/controllers/authController";
import { isLogedIn } from "@/middlewares/authMiddleware";
import express from "express"
const router = express.Router();

router.post("/register", signUp);
router.post("/login", login);
router.post("/logout", isLogedIn, logout);
// router.get("/auth/islogedin", isLogedIn);



export default router