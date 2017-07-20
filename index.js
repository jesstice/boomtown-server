import express from 'express';
import bodyParser from 'body-parser';
import {
  graphqlExpress,
  graphiqlExpress
} from 'graphql-server-express';
import cors from 'cors';

import schema from './api/schema';

const GQL_PORT = 4400;
const app = express();

app.use('*', cors()); // TO DO: see what params to include

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema })); // set up graphql endpoint

app.use('/graphiql', graphiqlExpress({ 
  endpointURL: '/graphql' // need to tell graphiql where the graphql endpoint is
}));

app.listen(GQL_PORT, () => console.log(
  `GraphQL is now running localhost:${GQL_PORT}/graphql`
));