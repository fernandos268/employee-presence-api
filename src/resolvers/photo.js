import { Photo } from "../Models"
import path from 'path'
import fs from 'fs'

export default {
    Query: {

    },
    Mutation: {
        addPhoto: async (parent, { file, description }) => {
            const { stream, filename, mimetype } = await file
            console.log({ stream, filename, mimetype, description })
            const file_name = path.basename(filename)
            const filepath = path.join('./uploads', file_name)
            const ws = fs.createWriteStream(filepath)
            stream.pipe(ws)

            const photo = new Photo({
                fileName: filename,
                fileLocation: filepath,
                description
            })

            const result = await photo.save()

            stream.on('end', () => {
                return result
            })
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
