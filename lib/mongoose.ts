import mongoose, { Mongoose } from "mongoose";
import logger from "./logger";
import "@/database";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("请在环境变量中设置 MONGODB_URI");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache;
}

let cache = global.mongooseCache;

if (!cache) {
  cache = global.mongooseCache = {
    conn: null,
    promise: null,
  };
}

async function dbConnet(): Promise<Mongoose> {
  if (cache.conn) {
    logger.info("Using existing mongoose connection");
    return cache.conn;
  }
  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "devflow",
      })
      .then((result) => {
        logger.info("MongoDB 连接成功");
        return result;
      })
      .catch((error) => {
        logger.error("MongoDB 连接失败", error);
        throw error;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

export default dbConnet;
