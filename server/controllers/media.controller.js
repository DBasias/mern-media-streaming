import fs from "fs";
import formidable from "formidable";
import errorHandler from "../helpers/dbErrorHandler";
import Media from "../models/media.model";

import mongoose from "mongoose";
import { RssFeed } from "@material-ui/icons";
let gridfs = null;
mongoose.connection.on("connected", () => {
  gridfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
});

const create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Video could not be uploaded",
      });
    }

    let media = new Media(fields);
    media.postedBy = req.profile;

    if (files.video) {
      let writeStream = gridfs.openUploadStream(media._id, {
        contentType: files.video.type || "binary/octet-stream",
      });

      fs.createReadStream(files.video.path).pipe(writeStream);
    }

    try {
      let result = await media.save();

      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const video = (req, res) => {
  const range = req.headers["range"];

  if (range && typeof range === "string") {
    const parts = range.replace(/bytes=/, "").split("-");
    const partialStart = parts[0];
    const partialEnd = parts[1];

    const start = parseInt(partialStart, 10);
    const end = partialEnd ? parseInt(partialEnd, 10) : req.file.length - 1;
    const chunkSize = end - start + 1;

    res.writeHead(206, {
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Range": "bytes " + start + "-" + end + "/" + req.file.length,
      "Content-Type": req.file.contentType,
    });

    let downloadStream = gridfs.openDownloadStream(req.file._id, {
      start,
      end: end + 1,
    });
    downloadStream.pipe(res);
    downloadStream.on("error", () => {
      res.sendStatus(404);
    });
    downloadStream.on("end", () => {
      res.end();
    });
  } else {
    res.header("Content-Length", req.file.length);
    res.header("Content-Type", req.file.contentType);

    let downloadStream = gridfs.openDownloadStream(req.file._id);
    downloadStream.pipe(res);
    downloadStream.on("error", () => {
      res.sendStatus(404);
    });
    downloadStream.on("end", () => {
      res.end();
    });
  }
};

const mediaById = async (req, res, next, id) => {
  try {
    let media = await Media.findById(id)
      .populate("postedBy", "_id name")
      .exec();

    if (!media) {
      return res.status(400).json({
        error: "Media not found",
      });
    }

    req.media = media;

    let files = await gridfs.find({ filename: media._id }).toArray();

    if (!files[0]) {
      return res.status(404).json({
        error: "No video found",
      });
    }

    req.file = files[0];

    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve media file",
    });
  }
};

export default { create, video, mediaById };
