import claimModel from "@/models/claimModel";
import lostItemModel from "@/models/lostItemModel";
import foundItemModel from "@/models/foundItemModel";
import notificationModel from "@/models/notificationModel";
import { UserRequest } from "@/interface/global.interface";
import { Request, Response } from "express";
import { Types } from "mongoose";

// Submit a new claim for an item
async function postClaim(req: Request, res: Response) {
  try {
    const { itemId, itemType, description, proofImage } = req.body;

    if (!itemId || !itemType || !description) {
      return res.status(400).json({ 
        message: "Item ID, type, and description are required for a claim." 
      });
    }

    const tempUser = (req as UserRequest).user;
    
    // Check if the user already claimed this item
    const existingClaim = await claimModel.findOne({
      item_id: new Types.ObjectId(itemId),
      user_id: new Types.ObjectId(tempUser.id)
    });

    if (existingClaim) {
      return res.status(400).json({ message: "You have already submitted a claim for this item." });
    }

    const claim = await claimModel.create({
      item_id: new Types.ObjectId(itemId),
      itemModel: itemType === 'lost' ? 'lostItem' : 'foundItem',
      user_id: new Types.ObjectId(tempUser.id),
      description,
      proofImage
    });

    if (claim) {
      // Notify the original item reporter
      let itemOwnerId = null;
      let title = "";
      if (itemType === 'lost') {
        const item = await lostItemModel.findById(itemId);
        itemOwnerId = item?.user_id;
        title = item?.itemName || "an item";
      } else {
        const item = await foundItemModel.findById(itemId);
        itemOwnerId = item?.user_id;
        title = item?.itemName || "an item";
      }

      if (itemOwnerId) {
        await notificationModel.create({
          user_id: itemOwnerId,
          title: "New Claim Submitted",
          message: `Someone submitted a claim for ${title}.`,
          type: "CLAIM_NEW"
        });
      }

      return res.status(201).json({
        message: "Your claim has been submitted successfully and is pending review.",
        data: claim
      });
    } else {
      throw new Error("Failed to create claim record.");
    }
  } catch (err: any) {
    return res.status(500).json({
      message: "Internal server error while posting claim",
      err: err.message
    });
  }
}

// View own claims
async function viewMyClaims(req: Request, res: Response) {
  try {
    const tempUser = (req as UserRequest).user;
    const userObjectId = new Types.ObjectId(tempUser.id);
    
    const claims = await claimModel.find({ user_id: userObjectId })
      .populate('item_id')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Claims fetched successfully!",
      data: claims
    });
  } catch (err: any) {
    return res.status(500).json({
      message: "Unexpected error while fetching your claims.",
      err: err.message
    });
  }
}

// Update claim status (Admin only in production, but let's implement for the user)
async function updateClaimStatus(req: Request, res: Response) {
  try {
    const { claimId } = req.params;
    const { status } = req.body; // APPROVED or REJECTED

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const claim = await claimModel.findByIdAndUpdate(
      claimId,
      { status },
      { new: true }
    );

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    // Sync Item Status if claim is Approved
    if (status === "APPROVED") {
      if (claim.itemModel === "lostItem") {
        await lostItemModel.findByIdAndUpdate(claim.item_id, { status: "RECOVERED" });
      } else if (claim.itemModel === "foundItem") {
        await foundItemModel.findByIdAndUpdate(claim.item_id, { status: "RECOVERED" });
      }
    }

    // Notify the user who submitted the claim
    await notificationModel.create({
      user_id: claim.user_id,
      title: `Claim ${status}`,
      message: `Your claim has been ${status.toLowerCase()}.`,
      type: "CLAIM_UPDATE"
    });

    return res.status(200).json({
      message: `Claim ${status.toLowerCase()} successfully! Item updated.`,
      data: claim
    });
  } catch (err: any) {
    return res.status(500).json({
      message: "Error updating claim status",
      err: err.message
    });
  }
}

export {
  postClaim,
  viewMyClaims,
  updateClaimStatus
};
