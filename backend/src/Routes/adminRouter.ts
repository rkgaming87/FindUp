import express from "express";
const router = express.Router();
import {
  getAllUsers,
  blockOrUnblockUser,
  getAllItems,
  deleteItem,
  getAllClaims,
} from "@/controllers/adminController";
import { isLogedIn, isAdmin } from "@/middlewares/authMiddleware";

router.get("/users", isLogedIn, isAdmin, getAllUsers);
router.patch("/users/:userId/status", isLogedIn, isAdmin, blockOrUnblockUser);
router.get("/items", isLogedIn, isAdmin, getAllItems);
router.delete("/items/:itemId", isLogedIn, isAdmin, deleteItem);
router.get("/claims", isLogedIn, isAdmin, getAllClaims);

export default router;
