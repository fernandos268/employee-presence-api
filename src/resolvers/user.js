import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { User } from '../Models'

import { signinAttempt, AuthErrorResponse } from '../utils/userAuth'

export default {
   Query: {
      me: async (parent, args, { req }, info) => {
         return await User.findById(req.session.userId)
      },
      users: async (parent, args, { req }, info) => {
         // if (!req.isAuth) {
         //    return AuthErrorResponse();
         // }

         const Users = await User.find({})

         return {
            ok: true,
            errors: [],
            list: Users
         }
      },
      user: async (parent, args, { req }, info) => {
         // if (!req.isAuth) {
         //    return AuthErrorResponse();
         // }
         const user = await User.findById(args.id)
         return {
            ok: true,
            errors: [],
            user
         }
      }
   },
   Mutation: {
      signin: async (parent, { email, password }, { context }, info) => {
         console.log('#############################################################################################')
         console.log('signin', context.req)
         const user = await signinAttempt({ email, password })
         context.req.session.userId = user.id
         return user
      },
      signup: async (parent, { input }, { req }, info) => {
         try {
            const { email, password } = input
            const isExistingUser = await User.findOne({ email });
            if (isExistingUser) {
               return {
                  email: null,
                  ok: false,
                  errors: [{
                     path: "email",
                     message: "Email is already used"
                  }]
               };
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({
               ...input,
               password: hashedPassword
            })
            const result = await user.save()

            const token = jwt.sign(
               {
                  userId: result.id,
                  email: result.email,
                  username: result.username
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
               user: result,
            };
         } catch (e) {
            return {
               ok: false,
               errors: [{ path: e.path, message: e.message }]
            }
         }
      }
   },
   User: {
      createdOvertimes: async (user, args, { req }, info) => {
         return (await user.populate('createdOvertimes').execPopulate()).createdOvertimes
      }
   }
}
