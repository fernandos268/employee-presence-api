import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../Models";

export const signinAttempt = async params => {
   const {
      email,
      password,
      req
   } = params

   console.log('signinAttempt --> req ---> ', req)

   try {
      const user = await User.findOne({ email });
      // if (!user) {
      //    return {
      //       ok: false,
      //       errors: [
      //          {
      //             path: "signinCredentials",
      //             message: "User does not exist!"
      //          }
      //       ]
      //    };
      // }

      if (!user) {
         throw new Error('User does not exist')
      }

      const isValid = await bcrypt.compare(
         password,
         user.password
      )

      if (!isValid) {
         // return {
         //    ok: false,
         //    errors: [
         //       {
         //          path: "signinCredentials",
         //          message: "Password is incorrect!"
         //       }
         //    ]
         // };
         throw new Error('Email or Password does not match')
      }

      // const token = jwt.sign(
      //    {
      //       userId: user.id,
      //       email: user.email,
      //       username: user.username
      //    },
      //    "myveryawesomesecretkey",
      //    {
      //       expiresIn: "1h"
      //    }
      // );

      // return {
      //    token,
      //    ok: true,
      //    errors: [],
      //    user,
      //    tokenExpiration: 1
      // };

      req.session.userId =  user.id

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
