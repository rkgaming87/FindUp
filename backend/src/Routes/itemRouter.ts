import {
  changeLostItemStatus,
  deleteOneItem,
  postLostItem,
  updateLostItem,
  viewSingleLostItemById,
} from "@/controllers/itemsController";
import { viewAllLostItems } from "@/controllers/userController";
import { isLogedIn } from "@/middlewares/authMiddleware";
import express from "express";

const router = express.Router();

router.post("/lost-items", isLogedIn, postLostItem);
router.put("/lost-items/:slug", isLogedIn, updateLostItem);
router.get("/lost-items", viewAllLostItems);
router.get("/lost-items/:slug", viewSingleLostItemById);
router.patch("/lost-items/:slug/status", isLogedIn, changeLostItemStatus);
router.delete("/lost-items/:slug", isLogedIn, deleteOneItem);

export default router;
