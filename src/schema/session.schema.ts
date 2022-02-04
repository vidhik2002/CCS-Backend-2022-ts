import { object, string } from "zod";
import constants from "../tools/constants";

export const createSessionSchema = object({
  body: object({
    email: string().email(),
    // username: string().optional(),
    password: string({
      required_error: "Password is required",
    }),
  })
    .refine((data) => data.email, {
      message: "Email is required",
      path: ["email"],
    })
    // .refine(
    //   (data) => !data.username || constants.usernameRegex.test(data.username),
    //   {
    //     message: "invalid username",
    //     path: ["username"],
    //   }
    // )
    .refine((data) => constants.passwordRegex.test(data.password), {
      message: "invalid password",
      path: ["password"],
    }),
});

export type SessionInput = {
  email: string;
  password: string;
};
