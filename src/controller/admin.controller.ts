import { Request, Response } from "express";
import { AdminGetUserInput, AdminPostInput } from "../schema/adminPost.schema";
import {
  getAllUsers,
  getCcsUserByUsername,
  getCcsUserInfoByUsername,
} from "../service/ccsUser.service";
import { getAllQuestion } from "../service/question.service";
import errorObject from "../utils/errorObject";
import logger from "../utils/logger";
import standardizeObject from "../utils/standardizeObject";

export async function getUsersHandler(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    return res.status(200).send(errorObject(200, "", users));
  } catch (e) {
    logger.error(e);
    return res.status(500).send(errorObject(500, "", standardizeObject(e)));
  }
}
export async function getUserInfoHandler(
  req: Request<AdminGetUserInput>,
  res: Response
) {
  try {
    const user = await getCcsUserInfoByUsername(req.params.username);
    const questions = await getAllQuestion();
    return res.status(200).send(errorObject(200, "", { user, questions }));
  } catch (e) {
    logger.error(e);
    return res.status(500).send(errorObject(500, "", standardizeObject(e)));
  }
}
export async function updateCcsUserHandler(
  req: Request<Record<string, never>, Record<string, never>, AdminPostInput>,
  res: Response
) {
  try {
    const user = await getCcsUserByUsername(req.body.username);
    switch (req.body.domain) {
      case "tech":
        if (req.body.round) {
          user.techRound = req.body.round;
        }
        if (req.body.comment) {
          user.comments.tech.push(req.body.comment);
        }
        if (req.body.mark) {
          user.marks.tech = req.body.mark;
        }
        break;
      case "management":
        if (req.body.round) {
          user.managementRound = req.body.round;
        }
        if (req.body.comment) {
          user.comments.management.push(req.body.comment);
        }
        if (req.body.mark) {
          user.marks.management = req.body.mark;
        }
        break;
      case "design":
        if (req.body.round) {
          user.designRound = req.body.round;
        }
        if (req.body.comment) {
          user.comments.design.push(req.body.comment);
        }
        if (req.body.mark) {
          user.marks.design = req.body.mark;
        }
        break;
      case "video":
        if (req.body.round) {
          user.videoRound = req.body.round;
        }
        if (req.body.comment) {
          user.comments.video.push(req.body.comment);
        }
        if (req.body.mark) {
          user.marks.video = req.body.mark;
        }
        break;
      default:
        break;
    }
    await user.save();
    return res
      .status(200)
      .send(errorObject(200, "user round successfully saved"));
  } catch (e) {
    logger.error(standardizeObject(e));
    return res.status(500).send(errorObject(500, "", standardizeObject(e)));
  }
}
