import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'itemModel'
    },
    itemModel: {
        type: String,
        required: true,
        enum: ['foundItem', 'lostItem'] // Usually claiming found items, but keeping flexible
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
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
})

const claimModel = mongoose.model("Claim", claimSchema);

export default claimModel
