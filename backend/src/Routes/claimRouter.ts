import express from "express";
import { postClaim, viewMyClaims, updateClaimStatus } from "@/controllers/claimController";
import { isLogedIn, isAdmin } from "@/middlewares/authMiddleware";

const router = express.Router();

router.post("/", isLogedIn, postClaim);
router.get("/my-claims", isLogedIn, viewMyClaims);
router.patch("/:claimId/status", isLogedIn, isAdmin, updateClaimStatus);

export default router;
