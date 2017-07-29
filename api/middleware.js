import admin from '../database/firebase';

function firebaseAuthMiddleware(req, res, next) {
    if (process.env.NODE_ENV === 'development' && req.headers.origin === 'http://localhost:4400') {
        return next();
    }
    const authorization = req.header('Authorization');
    if (authorization) {
        admin.auth().verifyIdToken(authorization)
        .then((decodedToken) => {
            res.locals.user = decodedToken;
            next();
        })
        .catch(err => {
            res.sendStatus(401);
            next();
        });
    } else {
        res.sendStatus(401);
        next();
    }
}

export default firebaseAuthMiddleware;
