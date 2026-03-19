import dbConnect from "./db";
import lostItemModel from "./src/models/lostItemModel";
import foundItemModel from "./src/models/foundItemModel";
import dotenv from "dotenv";

dotenv.config();

async function test() {
  await dbConnect();
  console.log("Connected");

  const skip = 0;
  const limit = 5;

  const total = await lostItemModel.countDocuments() + await foundItemModel.countDocuments();
  console.log("Total:", total);

  const items = await lostItemModel.aggregate([
    { $addFields: { type: "lost" } },
    { $unionWith: { coll: "founditems", pipeline: [{ $addFields: { type: "found" } }] } },
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
        "user_info": 0,
        "user_id.password": 0,
        "user_id.status": 0,
        "user_id.role": 0,
      }
    }
  ]);

  console.log("Items:", items.map(i => ({ name: i.itemName, type: i.type, user: i.user_id?.fullName })));
  process.exit(0);
}

test().catch(console.error);
