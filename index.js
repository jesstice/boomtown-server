import { } from 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import {
    graphqlExpress,
    graphiqlExpress
} from 'graphql-server-express';
import cors from 'cors';
import admin from './database/firebase';
import firebaseAuthMiddleware from './api/middleware';
import schema from './api/schema';
import createLoaders from './api/loaders';

const GQL_PORT = 4400;
const app = express();
const PORT = process.env.PORT;

app.use('*', cors());

app.use(bodyParser.json());

app.use('/graphql', firebaseAuthMiddleware);

app.use('/graphql', graphqlExpress(function(req, res) {
    return {
        schema,
        context: {
            loaders: createLoaders()
        }
    }
})); // set up graphql endpoint

app.use('/graphiql', graphiqlExpress({ 
    endpointURL: '/graphql' // need to tell graphiql where the graphql endpoint is
}));

app.listen(GQL_PORT, () => console.log(
    `GraphQL is now running localhost:${GQL_PORT}/graphql`
));
