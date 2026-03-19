import { Request } from "express";

export interface UserRequest extends Request {
  user: {
    email: string;
    id: string;
    role: string;
  };
}
