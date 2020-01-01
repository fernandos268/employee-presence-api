import { Photo } from "../Models"
import path from 'path'
import fs from 'fs'
import uuidV4 from 'uuid/v4'
import { createWriteStream, existsSync, mkdirSync } from 'fs'

const files = []

export default {
    Query: {

    },
    Mutation: {
        addPhoto: async (parent, { file, description }, context) => {
            console.log("TCL: context", context)
            const { createReadStream, filename } = await file;
            await new Promise(res =>
                createReadStream()
                    .pipe(createWriteStream(path.join(__dirname, "../../uploads", filename)))
                    .on("close", res)
            )

            const fileInfo = {
                id: uuidV4(),
                fileName,
                fileLocation: path.join(__dirname, "./uploads", filename),
                description
            }

            files.push(fileInfo)

            return fileInfo
        }
    }
    // singleUpload: (parent, args) => {
    //     return args.file.then(file => {
    //         const { createReadStream, filename, mimetype } = file

    //         const fileStream = createReadStream()

    //         fileStream.pipe(fs.createWriteStream(`./uploadedFiles/${filename}`))

    //         return file;
    //     });
    // },
    // singleUploadStream: async (parent, args) => {
    //     const file = await args.file
    //     const { createReadStream, filename, mimetype } = file
    //     const fileStream = createReadStream()


    //     console.log(result)


    //     return file;
    // }
}
