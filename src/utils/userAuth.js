import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../Models";

export const signinAttempt = async (email, password) => {
   try {
      const requestedUser = await User.findOne({ email });
      if (!requestedUser) {
         return {
            ok: false,
            errors: [
               {
                  path: "signinCredentials",
                  message: "User does not exist!"
               }
            ]
         };
      }

      const isPasswordMatch = await bcrypt.compare(
         password,
         requestedUser.password
      );
      if (!isPasswordMatch) {
         return {
            ok: false,
            errors: [
               {
                  path: "signinCredentials",
                  message: "Password is incorrect!"
               }
            ]
         };
      }

      const token = jwt.sign(
         {
            userId: requestedUser.id,
            email: requestedUser.email,
            username: requestedUser.username
         },
         "myveryawesomesecretkey",
         {
            expiresIn: "1h"
         }
      );

      return {
         token,
         ok: true,
         errors: [],
         user: requestedUser,
         tokenExpiration: 1
      };
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
