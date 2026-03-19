// src/index.ts
import express8 from "express";
import dotenv3 from "dotenv";

// db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
async function dbConnect() {
  try {
    await mongoose.connect(process.env.URL);
    console.log("Db connected successfully!");
  } catch (err) {
    console.log("Db connection failed!!", err);
  }
}
var db_default = dbConnect;

// src/models/userModel.ts
import mongoose2 from "mongoose";
var userSchema = new mongoose2.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String,
    default: null
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["ADMIN", "USER"],
    default: "USER"
  },
  status: {
    type: String,
    enum: ["ACTIVE", "BLOCKED"],
    default: "ACTIVE"
  }
});
var userModel = mongoose2.model("user", userSchema);
var userModel_default = userModel;

// src/controllers/authController.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv2 from "dotenv";
dotenv2.config();
async function signUp(req, res) {
  try {
    const { fullName, email, username, password } = req.body;
    if (!fullName || !email || !username || !password) {
      return res.status(400).json({ message: "name, email, username, password required" });
    }
    const existingUser = await userModel_default.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        message: "Username already registered!"
      });
    }
    const user = await userModel_default.create({
      fullName,
      email,
      username,
      password: await bcrypt.hash(password, 10),
      role: "USER",
      status: "ACTIVE"
    });
    if (!!user) {
      return res.status(201).json({
        message: "User Registered successfully!"
      });
    } else {
      throw new Error("Unexpected Error!");
    }
  } catch (err) {
    res.status(500).json({
      message: err && typeof err === "object" && "message" in err ? err.message : "Unknown error occured!",
      status: 404
    });
  }
}
async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await userModel_default.findOne({
      $or: [{ username }, { email: username }]
    });
    if (!user) {
      return res.status(401).json({
        message: "User not found!"
      });
    }
    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        message: "User is blocked!"
      });
    }
    const checkPass = bcrypt.compareSync(password, user.password);
    if (!checkPass) {
      return res.status(401).json({
        message: "Incorrect Password!"
      });
    }
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
        role: user.role
      },
      String(process.env.JWT_SECRET),
      {
        expiresIn: "1h",
        algorithm: "HS256"
      }
    );
    return res.cookie("access-token", token, {
      httpOnly: true,
      secure: false,
      // Since we are on http://localhost
      sameSite: "lax",
      maxAge: 36e5,
      // 1 hour
      path: "/"
    }).send({
      message: "Login Successfull",
      token
    });
  } catch (err) {
    res.status(500).json({
      message: err && typeof err === "object" && "message" in err ? err.message : "Unknown error occured!",
      status: 500
    });
  }
}
async function logout(req, res) {
  try {
    res.clearCookie("access-token").send({
      message: "Logout successful!"
    });
  } catch (e) {
    res.status(500).json({
      message: e && typeof e === "object" && "message" in e ? e.message : "Unknown error occured!",
      status: 500
    });
  }
}

// src/middlewares/authMiddleware.ts
import jwt2 from "jsonwebtoken";
async function isLogedIn(req, res, next) {
  try {
    const token = req.cookies["access-token"];
    if (!token) {
      return res.status(401).json({
        authenticated: false,
        message: "No token found"
      });
    }
    const payload = jwt2.verify(
      token,
      String(process.env.JWT_SECRET)
    );
    req.user = payload;
    next();
  } catch (err) {
    console.error("isLogedIn Error:", err.message);
    res.clearCookie("access-token", { path: "/" });
    if (err.message == "jwt expired") {
      return res.status(401).json({
        message: "Session Expired!"
      });
    }
    return res.status(401).json({
      message: "Invalid token or session error"
    });
  }
}
async function isAdmin(req, res, next) {
  try {
    const user = req.user;
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Unauthorized!"
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      message: "Unexpected error!"
    });
  }
}

// src/Routes/authRouter.ts
import express from "express";
var router = express.Router();
router.post("/register", signUp);
router.post("/login", login);
router.post("/logout", isLogedIn, logout);
var authRouter_default = router;

// src/models/foundItemModel.ts
import mongoose3 from "mongoose";
var foundItemSchema = new mongoose3.Schema(
  {
    itemName: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    foundItemLocation: {
      type: String
    },
    itemImage: {
      type: String,
      default: null
    },
    reportedDate: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["PENDING", "RECOVERED"],
      default: "PENDING"
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    user_id: {
      type: mongoose3.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    isFlagged: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);
var foundItemModel = mongoose3.model("foundItem", foundItemSchema);
var foundItemModel_default = foundItemModel;

// src/models/lostItemModel.ts
import mongoose4 from "mongoose";
var lostItemSchema = new mongoose4.Schema({
  itemName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  lostItemLocation: {
    type: String
  },
  itemImage: {
    type: String,
    default: null
  },
  reportedDate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["PENDING", "RECOVERED"],
    default: "PENDING"
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  user_id: {
    type: mongoose4.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  isFlagged: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
var lostItemModel = mongoose4.model("lostItem", lostItemSchema);
var lostItemModel_default = lostItemModel;

// src/controllers/userController.ts
import { Types } from "mongoose";
async function viewUserProfile(req, res) {
  try {
    const tempUser = req.user;
    console.log(tempUser);
    const user = await userModel_default.findById(tempUser.id, {
      password: false,
      __v: false
    }).lean();
    if (!user) {
      return res.status(404).json({
        message: "User not found! Login first"
      });
    }
    return res.status(200).json({
      message: "User found successfully",
      data: user
    });
  } catch (err) {
    res.status(401).json({
      message: "Unexpected error!",
      err
    });
  }
}
async function updateUserProfile(req, res) {
  try {
    const tempUser = req.user;
    const { fullName, email, avatar } = req.body;
    const userObjectId = new Types.ObjectId(tempUser.id);
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (avatar !== void 0) updateData.avatar = avatar;
    const user = await userModel_default.findOneAndUpdate(
      { _id: userObjectId },
      { $set: updateData },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({
        message: "User update failed"
      });
    }
    return res.status(200).json({
      message: "User updated successfully!",
      user
    });
  } catch (err) {
    res.status(401).json({
      message: "Unexpected error!",
      err
    });
  }
}
async function viewOwnItems(req, res) {
  try {
    const tempUser = req.user;
    const userObjectId = new Types.ObjectId(tempUser.id);
    const lostItem = await lostItemModel_default.find({
      user_id: userObjectId
    });
    const foundItem = await foundItemModel_default.find({
      user_id: userObjectId
    });
    if (!lostItem && !foundItem) {
      return res.status(401).json({
        message: "Can not get lost items"
      });
    }
    return res.status(200).json({
      message: "Items fetched successfully!",
      data: [...lostItem, ...foundItem]
    });
  } catch (err) {
    return res.status(500).json({
      message: "unexpected error!"
    });
  }
}
async function viewAllLostItems(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const lostItem = await lostItemModel_default.find().skip(skip).limit(limit);
    const total = await lostItemModel_default.countDocuments();
    if (!lostItem) {
      res.status(401).json({
        message: "Can not get lost items"
      });
    }
    res.status(201).json({
      message: "Lost items fetched successfully!",
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: lostItem
    });
  } catch (err) {
    res.status(501).json({
      message: "unexpected error!"
    });
  }
}
async function viewAllFoundItems(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const foundItem = await foundItemModel_default.find().skip(skip).limit(limit);
    const total = await foundItemModel_default.countDocuments();
    if (!foundItem) {
      res.status(401).json({
        message: "Can not get found items"
      });
    }
    res.status(201).json({
      message: "Found items fetched successfully!",
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: foundItem
    });
  } catch (err) {
    res.status(501).json({
      message: "unexpected error!"
    });
  }
}
async function viewAllItems(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const category = req.query.category || "";
    const matchQuery = {};
    if (search) {
      matchQuery.$or = [
        { itemName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    if (category && category !== "all") {
      matchQuery.category = { $regex: new RegExp(`^${category}$`, "i") };
    }
    const totalMatchCount = await lostItemModel_default.aggregate([
      { $addFields: { type: "lost" } },
      { $unionWith: { coll: "founditems", pipeline: [{ $addFields: { type: "found" } }] } },
      { $match: matchQuery },
      { $count: "total" }
    ]);
    const totalItems = totalMatchCount.length > 0 ? totalMatchCount[0].total : 0;
    const paginatedItems = await lostItemModel_default.aggregate([
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
          as: "user_info"
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
          "user_id.updatedAt": 0
        }
      }
    ]);
    return res.status(200).json({
      message: "Unified items fetched successfully!",
      page,
      limit,
      total: totalItems,
      totalPages: Math.ceil(totalItems / limit),
      data: paginatedItems
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unexpected error while fetching unified items registry",
      error: err.message
    });
  }
}
async function flagItem(req, res) {
  try {
    const { itemId } = req.params;
    let item = await lostItemModel_default.findByIdAndUpdate(
      itemId,
      { isFlagged: true },
      { new: true }
    );
    if (!item) {
      item = await foundItemModel_default.findByIdAndUpdate(
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
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unexpected error during item report flag.",
      error: err.message
    });
  }
}

// src/Routes/userRouter.ts
import express2 from "express";
var router2 = express2.Router();
router2.get("/me", isLogedIn, viewUserProfile);
router2.put("/me", isLogedIn, updateUserProfile);
router2.get("/me/items", isLogedIn, viewOwnItems);
router2.get("/all-items", viewAllItems);
router2.get("/lost-items", viewAllLostItems);
router2.get("/found-items", viewAllFoundItems);
router2.patch("/all-items/:itemId/flag", isLogedIn, flagItem);
var userRouter_default = router2;

// src/controllers/itemsController.ts
async function postLostItem(req, res) {
  try {
    const {
      itemName,
      category,
      description,
      lostItemLocation,
      itemImage,
      slug,
      reportedDate
    } = req.body;
    if (!itemName || !category || !description || !lostItemLocation || !slug || !reportedDate) {
      return res.status(400).json({
        message: "Item Name, category, Description, Lost Item Location, reportedDate and slug required!"
      });
    }
    const tempUser = req.user;
    const lostItem = await lostItemModel_default.create({
      itemName,
      category,
      description,
      lostItemLocation,
      itemImage,
      slug,
      reportedDate,
      user_id: tempUser.id
    });
    if (!!lostItem) {
      return res.status(201).json({
        message: "Your Lost item posted successfully!"
      });
    } else {
      throw new Error("Unexpected Error!");
    }
  } catch (err) {
    res.status(500).json({
      message: "Unexpected error!",
      err
    });
  }
}
async function updateLostItem(req, res) {
  const { slug } = req.params;
  console.log(slug);
  try {
    const { itemName, category, description, lostItemLocation } = req.body;
    const item = await lostItemModel_default.findOneAndUpdate(
      {
        slug
      },
      {
        itemName,
        category,
        description,
        lostItemLocation
      },
      {
        new: true
      }
    );
    if (!item) {
      res.status(400).json({
        message: "Item update failed"
      });
    }
    res.status(201).json({
      message: "Item Updated successfully!"
    });
  } catch (err) {
    res.status(501).json({
      message: "Unexpected error!",
      err
    });
  }
}
async function viewSingleLostItemById(req, res) {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(404).json({
        message: "slug or id Required"
      });
    }
    const lostItem = await lostItemModel_default.findOne({ slug }).populate("user_id", "fullName email");
    if (!lostItem) {
      return res.status(404).json({
        message: "lost item not found"
      });
    }
    res.status(200).json({
      message: "Lost item fetched successfully",
      lostItem
    });
  } catch (err) {
    res.status(500).json({
      message: "Unexpected error!",
      err
    });
  }
}
async function changeLostItemStatus(req, res) {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({
        message: "slug Required"
      });
    }
    const lostItem = await lostItemModel_default.findOneAndUpdate(
      { slug },
      {
        status: "RECOVERED"
      },
      {
        new: true
      }
    );
    console.log(lostItem);
    if (!lostItem) {
      return res.status(400).json({
        message: "item could not found!"
      });
    }
    res.status(200).json({
      message: "Item set to Recovered ",
      lostItem
    });
  } catch (err) {
    res.status(500).json({
      message: "unexpected server error",
      err
    });
  }
}
async function deleteOneItem(req, res) {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({
        message: "Slug Required"
      });
    }
    const findItem = await lostItemModel_default.findOne({ slug });
    if (!findItem) {
      return res.status(400).json({
        message: "Item not found"
      });
    } else {
      const deletedItem = await lostItemModel_default.deleteOne({ slug });
      if (!deletedItem) {
        return res.status(500).json({
          message: "Item delete failed"
        });
      }
      res.status(200).json({
        message: "Item deleted successfully!"
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Unexpected error!"
    });
  }
}

// src/Routes/itemRouter.ts
import express3 from "express";
var router3 = express3.Router();
router3.post("/lost-items", isLogedIn, postLostItem);
router3.put("/lost-items/:slug", isLogedIn, updateLostItem);
router3.get("/lost-items", viewAllLostItems);
router3.get("/lost-items/:slug", viewSingleLostItemById);
router3.patch("/lost-items/:slug/status", isLogedIn, changeLostItemStatus);
router3.delete("/lost-items/:slug", isLogedIn, deleteOneItem);
var itemRouter_default = router3;

// src/controllers/foundItemController.ts
async function postFoundItem(req, res) {
  try {
    const { itemName, category, description, foundItemLocation, itemImage, slug, reportedDate } = req.body;
    if (!itemName || !category || !description || !foundItemLocation || !slug || !reportedDate) {
      return res.status(400).json({ message: "Item Name, category, Description, Found Item Location, reportedDate and slug required!" });
    }
    const tempUser = req.user;
    const foundItem = await foundItemModel_default.create({
      itemName,
      category,
      description,
      foundItemLocation,
      itemImage,
      slug,
      reportedDate,
      user_id: tempUser.id
    });
    if (foundItem) {
      return res.status(201).json({
        message: "Your found item posted successfully!"
      });
    } else {
      throw new Error("Unexpected Error!");
    }
  } catch (err) {
    return res.status(500).json({
      message: "Unexpected error!",
      err
    });
  }
}
async function viewAllFoundItem(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const foundItem = await foundItemModel_default.find().skip(skip).limit(limit);
    const total = await foundItemModel_default.countDocuments();
    if (!foundItem) {
      return res.status(401).json({
        message: "Can not get found items"
      });
    }
    return res.status(200).json({
      message: "Found items fetched successfully!",
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: foundItem
    });
  } catch (err) {
    return res.status(500).json({
      message: "unexpected error!"
    });
  }
}
async function updateFoundItemStatus(req, res) {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({
        message: "slug Required"
      });
    }
    const foundItem = await foundItemModel_default.findOneAndUpdate(
      { slug },
      { status: "RETURNED" },
      { new: true }
    );
    if (!foundItem) {
      return res.status(400).json({
        message: "item could not found!"
      });
    }
    return res.status(200).json({
      message: "Item set to Returned ",
      foundItem
    });
  } catch (err) {
    return res.status(500).json({
      message: "unexpected server error",
      err
    });
  }
}
async function viewSingleFoundItemBySlug(req, res) {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(404).json({
        message: "slug Required"
      });
    }
    const foundItem = await foundItemModel_default.findOne({ slug }).populate("user_id", "fullName email");
    if (!foundItem) {
      return res.status(404).json({
        message: "found item not found"
      });
    }
    return res.status(200).json({
      message: "Found item fetched successfully",
      foundItem
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unexpected error!",
      err
    });
  }
}

// src/Routes/foundItemRouter.ts
import express4 from "express";
var Router = express4.Router();
Router.post("/found-items", isLogedIn, postFoundItem);
Router.get("/found-items", viewAllFoundItem);
Router.get("/found-items/:slug", viewSingleFoundItemBySlug);
Router.patch("/found-items/:slug/status", isLogedIn, updateFoundItemStatus);
var foundItemRouter_default = Router;

// src/index.ts
import cookieParser from "cookie-parser";

// src/Routes/adminRouter.ts
import express5 from "express";

// src/models/claimModel.ts
import mongoose5 from "mongoose";
var claimSchema = new mongoose5.Schema({
  item_id: {
    type: mongoose5.Schema.Types.ObjectId,
    required: true,
    refPath: "itemModel"
  },
  itemModel: {
    type: String,
    required: true,
    enum: ["foundItem", "lostItem"]
    // Usually claiming found items, but keeping flexible
  },
  user_id: {
    type: mongoose5.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  description: {
    type: String,
    required: true
  },
  proofImage: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING"
  }
}, {
  timestamps: true
});
var claimModel = mongoose5.model("Claim", claimSchema);
var claimModel_default = claimModel;

// src/controllers/adminController.ts
async function getAllUsers(req, res) {
  try {
    const users = await userModel_default.find({}, "fullName username status");
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
async function blockOrUnblockUser(req, res) {
  try {
    const { userId } = req.params;
    const user = await userModel_default.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.status = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    await user.save();
    res.status(200).json({
      success: true,
      message: `User ${user.status === "BLOCKED" ? "blocked" : "unblocked"} successfully`
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
async function getAllItems(req, res) {
  try {
    const lostItems = await lostItemModel_default.find(
      {},
      "itemImage itemName category description status slug isFlagged"
    );
    const foundItems = await foundItemModel_default.find(
      {},
      "itemImage itemName category description status slug isFlagged"
    );
    res.status(200).json({ success: true, lostItems, foundItems });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
async function deleteItem(req, res) {
  try {
    const { itemId } = req.params;
    const lostItem = await lostItemModel_default.findByIdAndDelete(itemId);
    const foundItem = await foundItemModel_default.findByIdAndDelete(itemId);
    if (!lostItem && !foundItem) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    res.status(200).json({
      success: true,
      message: "Item deleted successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
async function getAllClaims(req, res) {
  try {
    const claims = await claimModel_default.find({}).populate("user_id", "fullName email").populate("item_id", "itemName description status").sort({ createdAt: -1 });
    res.status(200).json({ success: true, claims });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// src/Routes/adminRouter.ts
var router4 = express5.Router();
router4.get("/users", isLogedIn, isAdmin, getAllUsers);
router4.patch("/users/:userId/status", isLogedIn, isAdmin, blockOrUnblockUser);
router4.get("/items", isLogedIn, isAdmin, getAllItems);
router4.delete("/items/:itemId", isLogedIn, isAdmin, deleteItem);
router4.get("/claims", isLogedIn, isAdmin, getAllClaims);
var adminRouter_default = router4;

// src/Routes/claimRouter.ts
import express6 from "express";

// src/models/notificationModel.ts
import mongoose6, { Schema } from "mongoose";
var notificationSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["CLAIM_NEW", "CLAIM_UPDATE", "SYSTEM"],
      default: "SYSTEM"
    },
    read: {
      type: Boolean,
      default: false
    },
    link: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);
var notificationModel = mongoose6.models.notification || mongoose6.model("notification", notificationSchema);
var notificationModel_default = notificationModel;

// src/controllers/claimController.ts
import { Types as Types3 } from "mongoose";
async function postClaim(req, res) {
  try {
    const { itemId, itemType, description, proofImage } = req.body;
    if (!itemId || !itemType || !description) {
      return res.status(400).json({
        message: "Item ID, type, and description are required for a claim."
      });
    }
    const tempUser = req.user;
    const existingClaim = await claimModel_default.findOne({
      item_id: new Types3.ObjectId(itemId),
      user_id: new Types3.ObjectId(tempUser.id)
    });
    if (existingClaim) {
      return res.status(400).json({ message: "You have already submitted a claim for this item." });
    }
    const claim = await claimModel_default.create({
      item_id: new Types3.ObjectId(itemId),
      itemModel: itemType === "lost" ? "lostItem" : "foundItem",
      user_id: new Types3.ObjectId(tempUser.id),
      description,
      proofImage
    });
    if (claim) {
      let itemOwnerId = null;
      let title = "";
      if (itemType === "lost") {
        const item = await lostItemModel_default.findById(itemId);
        itemOwnerId = item?.user_id;
        title = item?.itemName || "an item";
      } else {
        const item = await foundItemModel_default.findById(itemId);
        itemOwnerId = item?.user_id;
        title = item?.itemName || "an item";
      }
      if (itemOwnerId) {
        await notificationModel_default.create({
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
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error while posting claim",
      err: err.message
    });
  }
}
async function viewMyClaims(req, res) {
  try {
    const tempUser = req.user;
    const userObjectId = new Types3.ObjectId(tempUser.id);
    const claims = await claimModel_default.find({ user_id: userObjectId }).populate("item_id").sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Claims fetched successfully!",
      data: claims
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unexpected error while fetching your claims.",
      err: err.message
    });
  }
}
async function updateClaimStatus(req, res) {
  try {
    const { claimId } = req.params;
    const { status } = req.body;
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }
    const claim = await claimModel_default.findByIdAndUpdate(
      claimId,
      { status },
      { new: true }
    );
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }
    if (status === "APPROVED") {
      if (claim.itemModel === "lostItem") {
        await lostItemModel_default.findByIdAndUpdate(claim.item_id, { status: "RECOVERED" });
      } else if (claim.itemModel === "foundItem") {
        await foundItemModel_default.findByIdAndUpdate(claim.item_id, { status: "RECOVERED" });
      }
    }
    await notificationModel_default.create({
      user_id: claim.user_id,
      title: `Claim ${status}`,
      message: `Your claim has been ${status.toLowerCase()}.`,
      type: "CLAIM_UPDATE"
    });
    return res.status(200).json({
      message: `Claim ${status.toLowerCase()} successfully! Item updated.`,
      data: claim
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error updating claim status",
      err: err.message
    });
  }
}

// src/Routes/claimRouter.ts
var router5 = express6.Router();
router5.post("/", isLogedIn, postClaim);
router5.get("/my-claims", isLogedIn, viewMyClaims);
router5.patch("/:claimId/status", isLogedIn, isAdmin, updateClaimStatus);
var claimRouter_default = router5;

// src/Routes/notificationRouter.ts
import express7 from "express";

// src/controllers/notificationController.ts
import { Types as Types4 } from "mongoose";
async function getUserNotifications(req, res) {
  try {
    const tempUser = req.user;
    const userObjectId = new Types4.ObjectId(tempUser.id);
    const notifications = await notificationModel_default.find({ user_id: userObjectId }).sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Notifications fetched successfully",
      data: notifications
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching notifications",
      err: err.message
    });
  }
}
async function markNotificationAsRead(req, res) {
  try {
    const { id } = req.params;
    const tempUser = req.user;
    const notification = await notificationModel_default.findOneAndUpdate(
      { _id: new Types4.ObjectId(id), user_id: new Types4.ObjectId(tempUser.id) },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found or unauthorized." });
    }
    return res.status(200).json({
      message: "Notification marked as read.",
      data: notification
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error marking notification as read",
      err: err.message
    });
  }
}
async function markAllNotificationsAsRead(req, res) {
  try {
    const tempUser = req.user;
    await notificationModel_default.updateMany(
      { user_id: new Types4.ObjectId(tempUser.id), read: false },
      { read: true }
    );
    return res.status(200).json({
      message: "All notifications marked as read."
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error marking all notifications as read",
      err: err.message
    });
  }
}
async function deleteNotification(req, res) {
  try {
    const { id } = req.params;
    const tempUser = req.user;
    const deleted = await notificationModel_default.findOneAndDelete({
      _id: new Types4.ObjectId(id),
      user_id: new Types4.ObjectId(tempUser.id)
    });
    if (!deleted) {
      return res.status(404).json({ message: "Notification not found or unauthorized." });
    }
    return res.status(200).json({
      message: "Notification deleted successfully."
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error deleting notification",
      err: err.message
    });
  }
}

// src/Routes/notificationRouter.ts
var router6 = express7.Router();
router6.use(isLogedIn);
router6.get("/me", getUserNotifications);
router6.put("/mark-all-read", markAllNotificationsAsRead);
router6.put("/:id/read", markNotificationAsRead);
router6.delete("/:id", deleteNotification);
var notificationRouter_default = router6;

// src/index.ts
import cors from "cors";
dotenv3.config();
var app = express8();
var PORT = process.env.PORT || 8005;
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
    credentials: true
  })
);
app.use(express8.json());
app.use(cookieParser());
db_default();
app.use("/api/auth", authRouter_default);
app.use("/api/users", userRouter_default);
app.use("/api", itemRouter_default);
app.use("/api", foundItemRouter_default);
app.use("/api/admin", adminRouter_default);
app.use("/api/claims", claimRouter_default);
app.use("/api/notifications", notificationRouter_default);
app.get("/", function(req, res) {
  res.send("Welcome to FindUp");
  return;
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map
