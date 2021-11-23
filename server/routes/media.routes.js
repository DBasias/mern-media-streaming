import express from "express";
import userCtrl from "../controllers/user.controller";
import authCtrl from "../controllers/auth.controller";
import mediaCtrl from "../controllers/media.controller";

const router = express.Router();

router
  .route("/api/media/new/:userId")
  .post(authCtrl.requireSignin, mediaCtrl.create);

router.route("/api/media/video/:videoId").get(mediaCtrl.video);

router.route("/api/media/listPopular").get(mediaCtrl.listPopular);

router.route("/api/media/by/:userId").get(mediaCtrl.listByUser);

router.param("userId", userCtrl.userByID);
router.param("videoId", mediaCtrl.mediaById);

export default router;
