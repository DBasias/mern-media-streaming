import mongoose from "mongoose";
let gridfs = null;
mongoose.connection.on("connected", () => {
  gridfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
});
