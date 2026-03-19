import { UserRequest } from "@/interface/global.interface";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function isLogedIn(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies["token"];
    if (!token) {
      // console.log("No token found in cookies");
      return res.status(401).json({
        authenticated: false,
        message: "No token found"
      });
    }
    const payload = jwt.verify(
      token,
      String(process.env.JWT_SECRET),
    ) as UserRequest["user"];
    // console.log(payload);
    (req as UserRequest).user = payload;
    next();
  } catch (err: unknown) {
    console.error("isLogedIn Error:", (err as Error).message);
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    if ((err as Error).message == "jwt expired") {
      return res.status(401).json({
        message: "Session Expired!",
      });
    }

    return res.status(401).json({
      message: "Invalid token or session error",
    });
  }
}

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as UserRequest).user;
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Unauthorized!",
      });
    }
    next();
  } catch (err: unknown) {
    return res.status(500).json({
      message: "Unexpected error!",
    });
  }
}
