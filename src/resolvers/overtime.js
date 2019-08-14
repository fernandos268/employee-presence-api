import { Overtime, User } from "../Models"
import { AuthErrorResponse } from "../utils/userAuth"
import moment from 'moment'
export default {
   Query: {
      overtime: async (parent, { id }, { req }) => {
         try {
            if (!req.isAuth) {
               return AuthErrorResponse()
            }

            const overtime = await Overtime.findById(id)
            return {
               ok: true,
               errors: [],
               overtime,
               list: []
            }
         } catch (e) {
            return {
               ok: false,
               errors: [{ path: e.path, message: e.message }],
               overtime: null
            }
         }
      },
      overtimes: async (parent, args, { req }) => {
         try {
            if (!req.isAuth) {
               return AuthErrorResponse()
            }

            // const overtimes = await Overtime.find({})
            //    .populate('createdBy')
            //    .populate('approver')
            //    .exec()

            const overtimes = await Overtime.find({})

            return {
               ok: true,
               errors: [],
               list: overtimes
            }
         } catch (e) {
            return {
               ok: false,
               errors: [{ path: e.path, message: e.message }],
               overtime: null
            }
         }
      }
   },
   Mutation: {
      createOvertime: async (parent, { input }, { req }) => {
         try {
            const createdBy = await User.findById(req.userId)
            const approver = await User.findById(input.approverId)

            const duration = moment
               .utc(moment(input.startDate, "DD/MM/YYYY HH:mm:ss")
                  .diff(moment(input.endDate, "DD/MM/YYYY HH:mm:ss")))
               .format("HH:mm:ss")

            const overtime = new Overtime({
               startDate: moment(input.startDate),
               endDate: moment(input.endDate),
               duration,
               description: input.description,
               createdBy: req.userId,
               approver: input.approverId,
               status: "Pending"
            })

            if (!createdBy) {
               return {
                  ok: false,
                  errors: [{ path: "creator", message: "User not found" }]
               }
            }
            if (!approver) {
               return {
                  ok: false,
                  errors: [{ path: "approver", message: "User not found" }]
               }
            }

            const result = await overtime
            .save()
            .then(createdOvertime => createdOvertime.populate('createdBy').populate('approver')
            .execPopulate())

            createdBy.createdOvertimes.push(overtime);
            await createdBy.save();

            approver.assignedOvertimes.push(overtime);
            await approver.save();


            return {
               ok: true,
               errors: [],
               overtime: result
            }
         } catch (e) {
            return {
               ok: false,
               errors: [{ path: e.path, message: e.message }],
               overtime: null
            }
         }
      },
      updateOvertime: async (parent, {id ,input }, { req }) => {
         try {
            if (!req.isAuth) {
               return AuthErrorResponse()
            }

            const overtime = await Overtime.findOneAndUpdate(id, {
               startDate: moment(input.startDate),
               endDate: moment(input.endDate),
               duration,
               description: input.description,
               updatedBy: req.userId,
               approver: input.approverId,
            })

            return {
               ok: true,
               errors: [],
               overtime: overtime
            }

         } catch (e) {
            return {
               ok: false,
               errors: [{ path: e.path, message: e.message }],
               overtime: null
            }
         }
      },
      deleteOvertime: async (parent, args, { req }) => {
         try {
         } catch (e) {
            return {
               ok: false,
               errors: [{ path: e.path, message: e.message }],
               overtime: null
            }
         }
      },
      overtimeApproval: async (parent, args, { req }) => {
         try {
         } catch (e) {
            return {
               ok: false,
               errors: [{ path: e.path, message: e.message }],
               overtime: null
            }
         }
      }
   },
   Overtime: {
      createdBy: async (overtime, args, context, info) => {
         return User.findById(overtime.createdBy)
      },
      updatedBy: async (overtime, args, context, info) => {
         return User.findById(overtime.updatedBy)
      },
      approver: async (overtime, args, context, info) => {
         return User.findById(overtime.approver)
      },
   }
}
