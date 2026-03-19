import {
  viewUserProfile,
  updateUserProfile,
  viewAllLostItems,
  viewAllFoundItems,
  viewOwnItems,
  viewAllItems,
  flagItem
} from "@/controllers/userController";
import { isLogedIn } from "@/middlewares/authMiddleware";
import express from "express";
const router = express.Router();

router.get("/me", isLogedIn, viewUserProfile);
router.put("/me", isLogedIn, updateUserProfile);
router.get("/me/items", isLogedIn, viewOwnItems);
router.get("/all-items", viewAllItems);
router.get("/lost-items", viewAllLostItems);
router.get("/found-items", viewAllFoundItems);
router.patch("/all-items/:itemId/flag", isLogedIn, flagItem);

export default router;
