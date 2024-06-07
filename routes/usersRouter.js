import express from "express";

import AuthController from "../controllers/usersControllers.js";

import validateBody from "../helpers/validateBody.js";
import {
  createUserSchema,
  loginUserSchema,
  updateSubscriptionSchema,
} from "../schemas/usersSchemas.js";

import authMiddleware from "../middlewares/auth.js";
import uploadMiddleware from "../middlewares/upload.js";

const router = express.Router();

router.post(
  "/register",
  validateBody(createUserSchema),
  AuthController.register
);
router.post("/login", validateBody(loginUserSchema), AuthController.login);
router.post("/logout", authMiddleware, AuthController.logout);
router.get("/current", authMiddleware, AuthController.current);
router.patch("/", authMiddleware, validateBody(updateSubscriptionSchema), AuthController.updateSubscription);

router.get("/avatars", authMiddleware, AuthController.avatar);
router.patch("/avatars", authMiddleware, uploadMiddleware.single("avatar"),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        message: "The file was not transferred.",
      });
    }
    next();
  },
  AuthController.updateAvatar
);

export default router;