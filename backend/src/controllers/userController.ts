import { UserRequest } from "@/interface/global.interface";
import foundItemModel from "@/models/foundItemModel";
import lostItemModel from "@/models/lostItemModel";
import userModel from "@/models/userModel";
import express, { Request, Response } from "express";
import { Types } from "mongoose";

async function viewUserProfile(req: Request, res: Response) {
  try {
    const tempUser = (req as UserRequest).user;
    console.log(tempUser);
    const user = await userModel
      .findById(tempUser.id, {
        password: false,
        __v: false,
      })
      .lean();
    // const { password, ...userWithoutPassword } = user;

    if (!user) {
      return res.status(404).json({
        message: "User not found! Login first",
      });
    }
    return res.status(200).json({
      message: "User found successfully",
      data: user,
    });
  } catch (err) {
    res.status(401).json({
      message: "Unexpected error!",
      err,
    });
  }
  // console.log(user)
}

async function updateUserProfile(req: Request, res: Response) {
  try {
    const tempUser = (req as UserRequest).user;
    const { fullName, email, avatar } = req.body;
    const userObjectId = new Types.ObjectId(tempUser.id);
    
    // Build update object based on provided fields
    const updateData: any = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await userModel.findOneAndUpdate(
      { _id: userObjectId },
      { $set: updateData },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({
        message: "User update failed",
      });
    }
    // console.log(user)
    return res.status(200).json({
      message: "User updated successfully!",
      user,
    });
  } catch (err) {
    res.status(401).json({
      message: "Unexpected error!",
      err,
    });
  }
}

//view own posted items

async function viewOwnItems(req: Request, res: Response) {
  try {
    const tempUser = (req as UserRequest).user;
    const userObjectId = new Types.ObjectId(tempUser.id);
    const lostItem = await lostItemModel.find({
      user_id: userObjectId,
    });
    const foundItem = await foundItemModel.find({
      user_id: userObjectId,
    });
    if (!lostItem && !foundItem) {
      return res.status(401).json({
        message: "Can not get lost items",
      });
    }
    return res.status(200).json({
      message: "Items fetched successfully!",
      data: [...lostItem, ...foundItem],
    });
  } catch (err) {
    return res.status(500).json({
      message: "unexpected error!",
    });
  }
}

//view All Items with limits and pagination
async function viewAllLostItems(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const lostItem = await lostItemModel.find().skip(skip).limit(limit);

    const total = await lostItemModel.countDocuments();
    if (!lostItem) {
      res.status(401).json({
        message: "Can not get lost items",
      });
    }

    res.status(201).json({
      message: "Lost items fetched successfully!",
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: lostItem,
    });
  } catch (err) {
    res.status(501).json({
      message: "unexpected error!",
    });
  }
}

async function viewAllFoundItems(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const foundItem = await foundItemModel.find().skip(skip).limit(limit);

    const total = await foundItemModel.countDocuments();
    if (!foundItem) {
      res.status(401).json({
        message: "Can not get found items",
      });
    }

    res.status(201).json({
      message: "Found items fetched successfully!",
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: foundItem,
    });
  } catch (err) {
    res.status(501).json({
      message: "unexpected error!",
    });
  }
}

async function viewAllItems(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;
    const search = req.query.search as string || "";
    const category = req.query.category as string || "";

    // Build Match Query for the unified stream
    const matchQuery: any = {};
    if (search) {
      matchQuery.$or = [
        { itemName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    if (category && category !== "all") {
      matchQuery.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    // Recalculate totals post-match
    const totalMatchCount = await lostItemModel.aggregate([
      { $addFields: { type: "lost" } },
      { $unionWith: { coll: "founditems", pipeline: [{ $addFields: { type: "found" } }] } },
      { $match: matchQuery },
      { $count: "total" }
    ]);
    const totalItems = totalMatchCount.length > 0 ? totalMatchCount[0].total : 0;

    const paginatedItems = await lostItemModel.aggregate([
      { $addFields: { type: "lost" } },
      { $unionWith: { coll: "founditems", pipeline: [{ $addFields: { type: "found" } }] } },
      { $match: matchQuery },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user_info",
        }
      },
      {
        $addFields: {
          user_id: { $arrayElemAt: ["$user_info", 0] }
        }
      },
      {
        $project: {
          user_info: 0,
          "user_id.password": 0,
          "user_id.status": 0,
          "user_id.role": 0,
          "user_id.createdAt": 0,
          "user_id.updatedAt": 0,
        }
      }
    ]);

    return res.status(200).json({
      message: "Unified items fetched successfully!",
      page,
      limit,
      total: totalItems,
      totalPages: Math.ceil(totalItems / limit),
      data: paginatedItems,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: "Unexpected error while fetching unified items registry",
      error: err.message
    });
  }
}

async function flagItem(req: Request, res: Response) {
  try {
    const { itemId } = req.params;
    
    // Check both collections safely
    let item = await lostItemModel.findByIdAndUpdate(
      itemId,
      { isFlagged: true },
      { new: true }
    );

    if (!item) {
      item = await foundItemModel.findByIdAndUpdate(
        itemId,
        { isFlagged: true },
        { new: true }
      );
    }

    if (!item) {
      return res.status(404).json({ success: false, message: "Item could not be found to report." });
    }

    return res.status(200).json({
      success: true,
      message: "Item has been successfully flagged for moderation review by an Admin."
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "Unexpected error during item report flag.",
      error: err.message
    });
  }
}

export {
  viewUserProfile,
  updateUserProfile,
  viewAllLostItems,
  viewAllFoundItems,
  viewOwnItems,
  viewAllItems,
  flagItem
};
