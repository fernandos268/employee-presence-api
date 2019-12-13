import { gql } from 'apollo-server-express'

export default gql`
    extend type Query {
        _: Boolean
    }

    extend type Mutation {
        addPhoto(file: Upload!, description: String): Photo!

    }

    type Photo {
        id: ID
        fileName: String
        fileLocation: String
        description: String
    }

`

// extend type Query {
    // getPhotos(page: Int): PhotoData
    // searchPhotos(searchQuery: String): PhotoData
// }


// editPhoto(id: ID, file: Upload!, description: String, tags: String): Photo!
// deletePhoto(id: ID): ID


// type PhotoData {
    // photos: [Photo]
    // page: Int
    // totalPhotos: Int
// }
