import bcrypt from "bcrypt";
import { InternalServerError } from "./appError.js";

export const hashData = async (data) => {
  try {
    if (!data) {
      throw new Error("Data to hash is required");
    }
    return await bcrypt.hash(data, 10);
  } catch (error) {
    throw new InternalServerError(`Error hashing data: ${error.message}`);
  }
};

export const compareData = async (data, hash) => {
  try {
    if (!data || !hash) {
      throw new Error("Data and hash are required for comparison");
    }
    return await bcrypt.compare(data, hash);
  } catch (error) {
    throw new InternalServerError(`Error comparing data: ${error.message}`);
  }
};