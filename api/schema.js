import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `

    type User {
        id: ID!
        email: String!
        fullname: String!
        bio: String
        items: [Item]
        borrowed: [Item]
    }

    type Item {
        id: ID!
        title: String!
        description: String!
        imageUrl: String
        tags: [Tag!]
        itemowner: User!
        createdOn: Int!
        available: Boolean!
        borrower: User
    }

    type Tag {
        title: String!
    }

    type Query {
        users: [User]
        user(id: ID!): User
        items: [Item]
        item(id: ID!): Item
        tags: [Tag]
    }

    type Mutation {
        addUser(
            fullname: String!
            bio: String
            email: String!
            password: String!
        ): User
        addItem(
            title: String!
            description: String!
            imageUrl: String
            tags: [String!]
            itemowner: ID!
        ): Item
    }

    `;

export default makeExecutableSchema({
    typeDefs,
    resolvers
});
