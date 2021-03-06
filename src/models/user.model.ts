import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

export interface UserInput {
  name: string;
  username: string;
  isVitian: boolean;
  email: string;
  phone: string;
  password: string;
  regNo: string;
  gender: string;
}

export const privateFields = [
  "password",
  "createdAt",
  "updatedAt",
  "emailVerificationToken",
  "passwordResetToken",
  "scope",
];

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  emailVerificationToken: string;
  verificationStatus: boolean;
  passwordResetToken: string;
  scope: string[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    regNo: {
      type: String,
      unique: true,
      sparse: true,
    },
    gender: {
      type: String,
      enum: ["M", "F"],
      required: true,
    },
    emailVerificationToken: {
      type: String,
      required: true,
    },
    verificationStatus: {
      type: Boolean,
      default: false,
      required: true,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    scope: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function hashPassword(next) {
  const user = this as UserDocument;

  if (!user.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

  const hash = bcrypt.hashSync(user.password, salt);

  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function compare(
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
