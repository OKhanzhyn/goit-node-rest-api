import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;

mongoose
  .connect(DB_URI)
  .then(() => console.log("Database connection successful"))
  .catch((err) => {
    console.log(`Database connection error: ${err.message}`);
    process.exit(1);
  });