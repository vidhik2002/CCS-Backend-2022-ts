import { Request, Response } from "express";
import config from "config";
import { omit } from "lodash";
import { validatePassword } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";

export default async function createUserSessionHandler(
  req: Request,
  res: Response
) {
  // Validate the user's password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  if (!user.verificationStatus) {
    return res.status(401).send("Email not verified");
  }

  // create an access token

  const accessToken = signJwt(
    omit(user, "verificationStatus"),
    "accessTokenPrivateKey",
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes,
  );
  // create a refresh token
  const refreshToken = signJwt(
    user,
    "refreshTokenPrivateKey",
    { expiresIn: config.get("refreshTokenTtl") } // 15 minutes
  );

  // return access & refresh tokens

  return res.send({ accessToken, refreshToken });
}

// export async function getUserSessionsHandler(req: Request, res: Response) {
//   const userId = res.locals.user._id;

//   const sessions = await findSessions({ user: userId, valid: true });

//   return res.send(sessions);
// }

// export async function deleteSessionHandler(req: Request, res: Response) {
//   const sessionId = res.locals.user.session;

//   await updateSession({ _id: sessionId }, { valid: false });

//   return res.send({
//     accessToken: null,
//     refreshToken: null,
//   });
// }
