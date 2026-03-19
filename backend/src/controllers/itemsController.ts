import lostItemModel from "@/models/lostItemModel";
import { UserRequest } from "@/interface/global.interface";
import express, { Request, Response } from "express";

//lost items API

//post a item

async function postLostItem(req: Request, res: Response) {
  try {
    const {
      itemName,
      category,
      description,
      lostItemLocation,
      itemImage,
      slug,
      reportedDate,
    } = req.body;

    if (!itemName || !category || !description || !lostItemLocation || !slug || !reportedDate) {
      return res.status(400).json({
        message:
          "Item Name, category, Description, Lost Item Location, reportedDate and slug required!",
      });
    }

    const tempUser = (req as UserRequest).user;
    const lostItem = await lostItemModel.create({
      itemName: itemName,
      category: category,
      description: description,
      lostItemLocation: lostItemLocation,
      itemImage: itemImage,
      slug: slug,
      reportedDate: reportedDate,
      user_id: tempUser.id,
    });

    if (!!lostItem) {
      return res.status(201).json({
        message: "Your Lost item posted successfully!",
      });
    } else {
      throw new Error("Unexpected Error!");
    }
  } catch (err) {
    res.status(500).json({
      message: "Unexpected error!",
      err,
    });
  }
}
//update a item

async function updateLostItem(req: Request, res: Response) {
  const { slug } = req.params;
  console.log(slug);
  try {
    const { itemName, category, description, lostItemLocation } = req.body;
    const item = await lostItemModel.findOneAndUpdate(
      {
        slug,
      },
      {
        itemName: itemName,
        category: category,
        description: description,
        lostItemLocation: lostItemLocation,
      },
      {
        new: true,
      },
    );

    if (!item) {
      res.status(400).json({
        message: "Item update failed",
      });
    }

    res.status(201).json({
      message: "Item Updated successfully!",
    });
  } catch (err) {
    res.status(501).json({
      message: "Unexpected error!",
      err,
    });
  }
}
//view single lost item by slug

async function viewSingleLostItemById(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(404).json({
        message: "slug or id Required",
      });
    }
    const lostItem = await lostItemModel.findOne({ slug }).populate("user_id", "fullName email");
    if (!lostItem) {
      return res.status(404).json({
        message: "lost item not found",
      });
    }
    res.status(200).json({
      message: "Lost item fetched successfully",
      lostItem,
    });
  } catch (err) {
    res.status(500).json({
      message: "Unexpected error!",
      err,
    });
  }
}
//change lost item status
async function changeLostItemStatus(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        message: "slug Required",
      });
    }
    const lostItem = await lostItemModel.findOneAndUpdate(
      { slug },
      {
        status: "RECOVERED",
      },
      {
        new: true,
      },
    );
    console.log(lostItem);

    if (!lostItem) {
      return res.status(400).json({
        message: "item could not found!",
      });
    }

    res.status(200).json({
      message: "Item set to Recovered ",
      lostItem,
    });
  } catch (err) {
    res.status(500).json({
      message: "unexpected server error",
      err,
    });
  }
}
//delete lost item
async function deleteOneItem(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({
        message: "Slug Required",
      });
    }
    const findItem = await lostItemModel.findOne({ slug });
    if (!findItem) {
      return res.status(400).json({
        message: "Item not found",
      });
    } else {
      const deletedItem = await lostItemModel.deleteOne({ slug });
      if (!deletedItem) {
        return res.status(500).json({
          message: "Item delete failed",
        });
      }
      res.status(200).json({
        message: "Item deleted successfully!",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Unexpected error!",
    });
  }
}

//Search item api

export {
  postLostItem,
  updateLostItem,
  viewSingleLostItemById,
  changeLostItemStatus,
  deleteOneItem,
};
