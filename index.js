import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// data:
import { books, authors } from "./data.js";

// Tip (type) tanımı:
const typeDefs = `#graphql

  type Author {
    id: ID!
    name: String!
    score: Float
    age: Int
    books(filter: String): [Book!] # filtreleme işlemi için
  }

  type Book {
    id: ID!
    title: String!
    author: Author
    author_id: ID!
    isPublsihed: Boolean
    score: Float
  }

  type Query {
    books: [Book!]
    book(id: ID!): Book!
    
    authors: [Author!]
    author(id: ID!): Author!
  }
  
`;

// resolvers (çözücü):
const resolvers = {
  Query: {
    books: () => books,
    book: (parent, args) => books.find((book) => book.id === args.id),

    authors: () => authors,
    author: (parent, args) => authors.find((author) => author.id === args.id),
  },
  Book: {
    author: (parent, args) =>
      authors.find((author) => author.id === parent.author_id),
  },
  Author: {
    books: (parent, args) => {
      let filtered = books.filter((book) => book.author_id === parent.id);

      if (args.filter) { // sorguda filter var ise
        filtered = filtered.filter((book) =>
          book.title.toLowerCase().startsWith(args.filter.toLowerCase()) // args.filter verisine göre filtreler.
        );
      }
      return filtered;
    },
  },
};

// apollo server:
const server = new ApolloServer({ typeDefs, resolvers }); // iki parametre alır. 1. tip tanımları, 2. resolvers

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
