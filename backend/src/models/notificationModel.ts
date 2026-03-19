import mongoose, { Schema, Document, Types } from "mongoose";

export interface INotification extends Document {
  user_id: Types.ObjectId;
  title: string;
  message: string;
  type: "CLAIM_NEW" | "CLAIM_UPDATE" | "SYSTEM";
  read: boolean;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["CLAIM_NEW", "CLAIM_UPDATE", "SYSTEM"],
      default: "SYSTEM",
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const notificationModel =
  mongoose.models.notification || mongoose.model<INotification>("notification", notificationSchema);

export default notificationModel;
