import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../middleware/errorHandler.js";
import { ownerRegistrationSchema } from "./owner.schemas.js";
import * as ownerController from "./owner.controller.js";

const router = Router();

/**
 * @route   POST /api/v1/owner/register
 * @desc    Register a new bus owner with vehicles
 * @access  Public
 */
router.post(
  "/register",
  validate(ownerRegistrationSchema),
  asyncHandler(ownerController.register),
);

/**
 * @route   GET /api/v1/owner/profile
 * @desc    Get owner profile with vehicles and documents
 * @access  Private (Owner only)
 */
router.get(
  "/profile",
  authenticate,
  authorize("owner"),
  asyncHandler(ownerController.getProfile),
);

/**
 * @route   PATCH /api/v1/owner/:id/verify
 * @desc    Verify or revoke owner verification
 * @access  Private (Admin only)
 */
router.patch(
  "/:id/verify",
  authenticate,
  authorize("admin"),
  asyncHandler(ownerController.verifyOwner),
);

export default router;
