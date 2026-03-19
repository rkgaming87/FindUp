import foundItemModel from "@/models/foundItemModel";
import { UserRequest } from "@/interface/global.interface";
import { Request, Response } from "express";

async function postFoundItem(req: Request, res: Response) {
  try {
    const { itemName, category, description, foundItemLocation, itemImage, slug, reportedDate } = req.body;

    if (!itemName || !category || !description || !foundItemLocation || !slug || !reportedDate) {
      return res.status(400).json({ message: "Item Name, category, Description, Found Item Location, reportedDate and slug required!" });
    }

    const tempUser = (req as UserRequest).user;
    const foundItem = await foundItemModel.create({
      itemName,
      category,
      description,
      foundItemLocation,
      itemImage,
      slug,
      reportedDate,
      user_id: tempUser.id,
    });

    if (foundItem) {
      return res.status(201).json({
        message: "Your found item posted successfully!",
      });
    } else {
      throw new Error("Unexpected Error!");
    }
  } catch (err) {
    return res.status(500).json({
      message: "Unexpected error!",
      err,
    });
  }
}

async function viewAllFoundItem(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const foundItem = await foundItemModel.find().skip(skip).limit(limit);
    const total = await foundItemModel.countDocuments();

    if (!foundItem) {
      return res.status(401).json({
        message: "Can not get found items",
      });
    }

    return res.status(200).json({
      message: "Found items fetched successfully!",
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: foundItem,
    });
  } catch (err) {
    return res.status(500).json({
      message: "unexpected error!",
    });
  }
}

async function updateFoundItemStatus(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        message: "slug Required",
      });
    }
    const foundItem = await foundItemModel.findOneAndUpdate(
      { slug },
      { status: "RETURNED" },
      { new: true }
    );

    if (!foundItem) {
      return res.status(400).json({
        message: "item could not found!",
      });
    }

    return res.status(200).json({
      message: "Item set to Returned ",
      foundItem,
    });
  } catch (err) {
    return res.status(500).json({
      message: "unexpected server error",
      err,
    });
  }
}

async function deleteFoundItem(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({
        message: "Slug Required",
      });
    }
    const findItem = await foundItemModel.findOne({ slug });
    if (!findItem) {
      return res.status(400).json({
        message: "Item not found",
      });
    } else {
      const deletedItem = await foundItemModel.deleteOne({ slug });
      if (!deletedItem) {
        return res.status(500).json({
          message: "Item delete failed",
        });
      }
      return res.status(200).json({
        message: "Item deleted successfully!",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Unexpected error!",
    });
  }
}

async function viewSingleFoundItemBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(404).json({
        message: "slug Required",
      });
    }
    const foundItem = await foundItemModel.findOne({ slug }).populate("user_id", "fullName email");
    if (!foundItem) {
      return res.status(404).json({
        message: "found item not found",
      });
    }
    return res.status(200).json({
      message: "Found item fetched successfully",
      foundItem,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unexpected error!",
      err,
    });
  }
}

export {
  postFoundItem,
  viewAllFoundItem,
  updateFoundItemStatus,
  deleteFoundItem,
  viewSingleFoundItemBySlug,
};