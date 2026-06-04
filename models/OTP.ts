import mongoose, { Schema, type Model } from "mongoose";

export type OtpProfileMeta = {
  name?: string;
  city?: string;
  skills?: string[];
  language?: string;
  role?: "plumber" | "customer";
};

export interface IOTP {
  phone: string;
  otp: string;
  expiresAt: Date;
  verified: boolean;
  attempts: number;
  profile?: OtpProfileMeta | null;
  createdAt: Date;
}

const OTPSchema = new Schema<IOTP>(
  {
    phone: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    verified: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
    profile: { type: Schema.Types.Mixed, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "otps" }
);

OTPSchema.index({ phone: 1, expiresAt: 1 });
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP: Model<IOTP> =
  mongoose.models.OTP ?? mongoose.model<IOTP>("OTP", OTPSchema);

export default OTP;
