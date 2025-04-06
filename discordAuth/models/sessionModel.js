import mongoose from "mongoose";

// User Session Schema
const sessionSchema = new mongoose.Schema({ _id: String, expires: Date, 
  session: {
    cookie: {
      originalMaxAge: Number,
      expires: Date,
      secure: Boolean,
      httpOnly: Boolean,
      path: String,
      sameSite: String
    },
    passport: {
      user: {
        id: String,
        username: String,
        avatar: String,
        discriminator: String,
        guilds: [String]
      }
    }
  }
}, { versionKey: false });

export default mongoose.model("Session", sessionSchema);