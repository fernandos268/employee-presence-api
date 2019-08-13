import { Overtime, User } from "../Models";
import { AuthErrorResponse } from "../utils/userAuth";

export default {
   Query: {
      overtime: async (parent, { id }, { req }) => {
         try {
            if (!req.isAuth) {
               return AuthErrorResponse();
            }

            const overtime = await Overtime.findById(id);
            return {
               ok: true,
               errors: [],
               overtime,
               list: []
            };
         } catch (e) {
            return {
               ok: false,
               errors: [{ path: e.path, message: e.message }],
               overtime: null
            };
         }
      },
      overtimes: async (parent, args, { req }) => {
         try {
            console.log(req.isAuth);
            if (!req.isAuth) {
               return AuthErrorResponse();
            }

            const overtimes = await Overtime.find({})
            .populate('User')
            .exec()

            return {
               ok: true,
               errors: [],
               list: overtimes
            };
         } catch (e) {
            return {
               ok: false,
               errors: [{ path: e.path, message: e.message }],
               overtime: null
            };
         }
      }
   },
   Mutation: {
      createOvertime: async (parent, args, { req }) => {
         try {
            const createdBy = User.findById(req.userId)
         } catch (e) {
            return {
               ok: false,
               errors: [{ path: e.path, message: e.message }],
               overtime: null
            };
         }
      },
      updateOvertime: async (parent, args, { req }) => {
         try {
         } catch (e) {
            return {
               ok: false,
               errors: [{ path: e.path, message: e.message }],
               overtime: null
            };
         }
      },
      deleteOvertime: async (parent, args, { req }) => {
         try {
         } catch (e) {
            return {
               ok: false,
               errors: [{ path: e.path, message: e.message }],
               overtime: null
            };
         }
      },
      overtimeApproval: async (parent, args, { req }) => {
         try {
         } catch (e) {
            return {
               ok: false,
               errors: [{ path: e.path, message: e.message }],
               overtime: null
            };
         }
      }
   }
};
