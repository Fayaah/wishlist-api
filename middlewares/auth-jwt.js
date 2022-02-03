const jwt = require("jsonwebtoken");
const config = require("dotenv").config();
const users = require("../data/users.json");

process.env;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided !"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized !"
            });
        }
        req.userId = decoded.id;
        next();
    });
}

isAdmin = (req, res, next) => {
    const user = users.find(u => u.id === req.userId);

    if (user) {
        const roles = user.roles;

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "administrator") {
                next();
                return;
            }
        }

        res.status(403).send({
            message: "Require Admin Role!"
        });
        return;
    }
}

isModerator = (req, res, next) => {
    const user = users.find(u => u.id === req.userId);

    if (user) {
        const roles = user.roles;

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "moderator") {
                next();
                return;
            }
        }

        res.status(403).send({
            message: "Require Moderator Role!"
        });
        return;
    }
}

isModeratorOrAdmin = (req, res, next) => {
    const user = users.find(u => u.id === req.userId);

    if (user) {
        const roles = user.roles;

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "administrator") {
                next();
                return;
            }

            if (roles[i].name === "moderator") {
                next();
                return;
            }
        }

        res.status(403).send({
            message: "Require Moderator or Admin Role!"
        });
        return;
    }
}

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isModerator: isModerator,
    isModeratorOrAdmin: isModeratorOrAdmin
}

module.exports = authJwt;