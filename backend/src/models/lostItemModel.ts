import mongoose from "mongoose";

const lostItemSchema = new mongoose.Schema({
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
        type: String,

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
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    isFlagged: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})

const lostItemModel = mongoose.model("lostItem", lostItemSchema);

export default lostItemModel