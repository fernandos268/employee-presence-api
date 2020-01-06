import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../Models";

export const signinAttempt = async params => {
   const {
      email,
      password,
   } = params

   try {
      const user = await User.findOne({ email })
      if (!user) {
         throw new Error('User does not exist')
      }

      const isValid = await bcrypt.compare(
         password,
         user.password
      )

      if (!isValid) {
         throw new Error('Email & Password does not match')
      }

      return user
   } catch (e) {
      throw new Error(e);
   }
}

export const AuthErrorResponse = () => ({
   ok: false,
   errors: [
      { path: "authentication", message: "User signin is required." }
   ],
   list: []
})
