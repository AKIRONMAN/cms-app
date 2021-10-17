const jwt = require("jsonwebtoken");
const config = require("../../config/config.json").development;
const User = require('../models/User');

verifyToken = (req, res, next) => {
    let token = req.headers["access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.loggedInUserId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findByPk(req.loggedInUserId).then(user => {
        if(user && user.userProfile === 'ADMIN'){
            next();
            return;
        }else{
            res.status(403).send({
                message: "Require ADMIN Role!"
            });
        }
    });
};

isModeratorOrAdmin = (req, res, next) => {
    User.findByPk(req.loggedInUserId    ).then(user => {
        console.log(user);
        if(user && user.userProfile === 'USER'){
            next();
            return;
        }else if(user && user.userProfile === 'ADMIN'){
            next();
            return;
        }else{
            res.status(403).send({
                message: "Require Moderator/ADMIN Role!"
            });
        }
    });
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;