import usersService from "../services/usersServices.js";
import * as fs from "fs/promises";
import path from "node:path";
import Jimp from "jimp";

export const register = async (req, res, next) => {
  try {
    const { password, email, subscription = "starter" } = req.body;
    const result = await usersService.registerUser({
      password,
      email,
      subscription,
    });

    if (result === null) {
      return res.status(409).send({ message: "Email in use" });
    }

    return res.status(201).send({
      user: {
        email: result.email,
        subscription: result.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const result = await usersService.loginUser(email, password);

    if (result === null) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }
    if (result === false) {
      return res.status(401).send({ message: "Please verify your email" });
    }

    return res.status(200).send({
      token: result.token,
      user: {
        email: result.user.email,
        subscription: result.user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await usersService.logoutUser(req.user.id);

    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const current = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    const result = usersService.currentUser(authorizationHeader);

    return res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = req.body.subscription;
    const id = req.user.id;

    const result = await usersService.updateSubscriptionUser(id, subscription);

    return res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const avatar = async (req, res, next) => {
  const id = req.user.id;

  try {
    const userAvatarFilePath = await usersService.getUserAvatar(id);

    const isStatic = await fs
      .access(userAvatarFilePath)
      .then(() => true)
      .catch(() => false);

    if (isStatic) {
      return res
        .status(200)
        .send({ avatarURL: "/avatars/" + userAvatarFilePath });
    } else {
      return res.status(200).send({ avatarURL: userAvatarFilePath });
    }
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const id = req.user.id;
    await fs.rename(
      req.file.path,
      path.resolve("public", "avatars", req.file.filename)
    );

    Jimp.read(
      path.resolve("public", "avatars", req.file.filename),
      (err, avatar) => {
        if (err) throw err;
        avatar
          .resize(256, 256)
          .quality(60)
          .write(path.resolve("public", "avatars", req.file.filename));
      }
    );
    const avatarURL = await usersService.updateUserAvatar(
      id,
      req.file.filename
    );

    return res.status(200).send({ avatarURL });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const result = await usersService.verifyUser(verificationToken);
    if (result == null) {
      res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "Email confirm successfully!" });
  } catch (error) {
    next(error);
  }
};

export const sendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await usersService.sendVerificationEmail(email);
    if (result == true) {
      res.status(400).send({ message: "Verification has already been passed" });
    }
    if (result == null) {
      res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "Verification email sent" });
  } catch (error) {}
};

export default {
  register,
  login,
  logout,
  current,
  updateSubscription,
  avatar,
  updateAvatar,
  verifyEmail,
  sendVerificationEmail,
};