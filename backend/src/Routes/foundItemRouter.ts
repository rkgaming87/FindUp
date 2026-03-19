import {
  postFoundItem,
  updateFoundItemStatus,
  viewAllFoundItem,
  viewSingleFoundItemBySlug,
} from "@/controllers/foundItemController";
import { isLogedIn } from "@/middlewares/authMiddleware";
import express from "express";

const Router = express.Router();

Router.post("/found-items", isLogedIn, postFoundItem);
Router.get("/found-items", viewAllFoundItem);
Router.get("/found-items/:slug", viewSingleFoundItemBySlug);
Router.patch("/found-items/:slug/status", isLogedIn, updateFoundItemStatus);

export default Router;
