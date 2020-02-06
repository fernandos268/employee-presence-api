import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../Models";

import { JWT_SECRET } from '../../config'

export const signinAttempt = async params => {
   const {
      email,
      password,
   } = params

   try {
      const user = await User.findOne({ email })
      if (!user) {
         // throw new Error('User does not exist')
         return {
            isSuccess: false,
            errors: [
               {
                  message: 'User does not exist',
                  path: 'Signin'
               }
            ]
         }
      }

      const isValid = await bcrypt.compare(
         password,
         user.password
      )

      if (!isValid) {
         // throw new Error('Email & Password does not match')
         return {
            isSuccess: false,
            errors: [
               {
                  message: 'Email & Passsword does not match',
                  path: 'Signin'
               }
            ]
         }
      }
      const token = jwt.sign(
         {
            userId: user.id
         },
         JWT_SECRET,
         {
            expiresIn: "1d"
         }
      )

      return {
         isSuccess: true,
         token,
         user,
         errors: []
      }
   } catch (e) {
      // throw new Error(e);
      return {
         isSuccess: false,
         errors: [
            {
               message: 'Server error',
               path: 'Signin'
            }
         ]
      }
   }
}

export const AuthErrorResponse = () => ({
   ok: false,
   errors: [
      { path: "authentication", message: "User signin is required." }
   ],
   list: []
})
