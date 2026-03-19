import express, { Request, Response } from "express";
import userModel from "@/models/userModel";
import lostItemModel from "@/models/lostItemModel";
import foundItemModel from "@/models/foundItemModel";
import claimModel from "@/models/claimModel";

async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await userModel.find({}, "fullName username status");
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function blockOrUnblockUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.status = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    await user.save();
    res.status(200).json({
      success: true,
      message: `User ${user.status === "BLOCKED" ? "blocked" : "unblocked"} successfully`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function getAllItems(req: Request, res: Response) {
  try {
    const lostItems = await lostItemModel.find(
      {},
      "itemImage itemName category description status slug isFlagged",
    );
    const foundItems = await foundItemModel.find(
      {},
      "itemImage itemName category description status slug isFlagged",
    );
    res.status(200).json({ success: true, lostItems, foundItems });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function deleteItem(req: Request, res: Response) {
  try {
    const { itemId } = req.params;
    const lostItem = await lostItemModel.findByIdAndDelete(itemId);
    const foundItem = await foundItemModel.findByIdAndDelete(itemId);
    if (!lostItem && !foundItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function getAllClaims(req: Request, res: Response) {
  try {
    const claims = await claimModel.find({})
      .populate("user_id", "fullName email")
      .populate("item_id", "itemName description status")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, claims });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export { getAllUsers, blockOrUnblockUser, getAllItems, deleteItem, getAllClaims };
