import express from "express";
import { isLogedIn } from "../middlewares/authMiddleware";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notificationController";

const router = express.Router();

router.use(isLogedIn);

router.get("/me", getUserNotifications);
router.put("/mark-all-read", markAllNotificationsAsRead);
router.put("/:id/read", markNotificationAsRead);
router.delete("/:id", deleteNotification);

export default router;
