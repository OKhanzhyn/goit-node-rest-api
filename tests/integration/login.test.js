import "dotenv/config";
import express from "express";
import app from "../../app.js";
import supertest from "supertest";
import User from "../../models/user.js";
import mongoose from "mongoose";

mongoose.set("strictQuery", false);
const DB_URI = process.env.DB_URI;

describe("Login", () => {
  beforeAll(async () => {
    await mongoose
      .connect(DB_URI)
      .then(() => {})
      .catch((err) => {
        process.exit(1);
      });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("Test №1 | Login must be successful |", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      password: "123456789",
      email: "poshta@gmail.com",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe("poshta@gmail.com");
  });

  test("Test №2 | Login must be unsuccessful |", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      password: "12345678",
      email: "poshta@gmail.com",
    });
    expect(response.statusCode).toBe(401);
  });
});