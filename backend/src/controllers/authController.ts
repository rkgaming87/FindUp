import express, { Request, Response } from "express";
import userModel from "@/models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserRequest } from "@/interface/global.interface";
dotenv.config();

async function signUp(req: Request, res: Response) {
  try {
    const { fullName, email, username, password } = req.body;
    if (!fullName || !email || !username || !password) {
      return res
        .status(400)
        .json({ message: "name, email, username, password required" });
    }
    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        message: "Username already registered!",
      });
    }

    const user = await userModel.create({
      fullName: fullName,
      email: email,
      username: username,
      password: await bcrypt.hash(password, 10),
      role: "USER",
      status: "ACTIVE",
    });

    if (!!user) {
      return res.status(201).json({
        message: "User Registered successfully!",
      });
    } else {
      throw new Error("Unexpected Error!");
    }
  } catch (err) {
    res.status(500).json({
      message:
        err && typeof err === "object" && "message" in err
          ? err.message
          : "Unknown error occured!",
      status: 404,
    });
  }
}

async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({
      $or: [{ username: username }, { email: username }],
    });
    if (!user) {
      return res.status(401).json({
        message: "User not found!",
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        message: "User is blocked!",
      });
    }
    const checkPass = bcrypt.compareSync(password, user.password);
    if (!checkPass) {
      return res.status(401).json({
        message: "Incorrect Password!",
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
        role: user.role,
      },
      String(process.env.JWT_SECRET),
      {
        expiresIn: "1h",
        algorithm: "HS256",
      },
    );
    return res.cookie("token", token, {
      httpOnly: true,
      secure: true, // required for HTTPS (Render + Vercel)
      sameSite: "none", // REQUIRED for cross-origin
      maxAge: 3600000, // 1 hour
      path: "/",
    }).send({
      message: "Login Successfull",
      token,
    });
  } catch (err) {
    res.status(500).json({
      message:
        err && typeof err === "object" && "message" in err
          ? err.message
          : "Unknown error occured!",
      status: 500,
    });
  }
}

async function logout(req: Request, res: Response) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    }).send({
      message: "Logout successful!",
    });
  } catch (e) {
    res.status(500).json({
      message:
        e && typeof e === "object" && "message" in e
          ? e.message
          : "Unknown error occured!",
      status: 500,
    });
  }
}

export { signUp, login, logout };
