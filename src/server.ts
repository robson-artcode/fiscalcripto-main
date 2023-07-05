const path = require("path");
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server";
import "reflect-metadata";
import { SignUpResolver } from "./resolvers/signup-resolver";

async function bootstrap() {

    const schema = await buildSchema({
        resolvers: [
            SignUpResolver,
        ],
        emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    })
    const server = new ApolloServer({
        schema,
        context: ({ req: { headers }}) => { return headers },
    })
    
    await server.listen()
}

bootstrap()