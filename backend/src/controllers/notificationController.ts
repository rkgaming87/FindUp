import { Request, Response } from "express";
import { Types } from "mongoose";
import notificationModel from "../models/notificationModel";
import { UserRequest } from "../interface/global.interface";

// 1. Get all notifications for the logged in user
export async function getUserNotifications(req: Request, res: Response) {
  try {
    const tempUser = (req as UserRequest).user;
    const userObjectId = new Types.ObjectId(tempUser.id);

    const notifications = await notificationModel
      .find({ user_id: userObjectId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Notifications fetched successfully",
      data: notifications,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: "Error fetching notifications",
      err: err.message,
    });
  }
}

// 2. Mark a notification as read
export async function markNotificationAsRead(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const tempUser = (req as UserRequest).user;

    const notification = await notificationModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), user_id: new Types.ObjectId(tempUser.id) },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found or unauthorized." });
    }

    return res.status(200).json({
      message: "Notification marked as read.",
      data: notification,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: "Error marking notification as read",
      err: err.message,
    });
  }
}

// 3. Mark all notifications as read
export async function markAllNotificationsAsRead(req: Request, res: Response) {
  try {
    const tempUser = (req as UserRequest).user;
    
    await notificationModel.updateMany(
      { user_id: new Types.ObjectId(tempUser.id), read: false },
      { read: true }
    );

    return res.status(200).json({
      message: "All notifications marked as read.",
    });
  } catch (err: any) {
    return res.status(500).json({
      message: "Error marking all notifications as read",
      err: err.message,
    });
  }
}

// 4. Delete a notification
export async function deleteNotification(req: Request, res: Response) {
  try {
     const { id } = req.params;
     const tempUser = (req as UserRequest).user;
     
     const deleted = await notificationModel.findOneAndDelete({
       _id: new Types.ObjectId(id),
       user_id: new Types.ObjectId(tempUser.id)
     });

     if (!deleted) {
       return res.status(404).json({ message: "Notification not found or unauthorized." });
     }

     return res.status(200).json({
       message: "Notification deleted successfully."
     });
  } catch(err: any) {
     return res.status(500).json({
       message: "Error deleting notification",
       err: err.message
     })
  }
}
