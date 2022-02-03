const users = require('../data/users.json');

checkDuplicateUsernameOrEmail = (req, res, next) => {
    const usernameUser = users.find(u => u.username === req.body.username);

    if (usernameUser) {
        res.status(400).send({
            message: "Failed! Username is already in use!"
        });
        return;
    } else {
        const mailUser = users.find(u => u.mail === req.body.mail);

        if (mailUser) {
            res.status(400).send({
                message: "Failed! Email is already in use!"
            });
            return;
        } else {
            next();
        }
    }
}

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!roles.find(r => r.name === req.body.roles[i])) {
                res.status(400).send({
                    message: "Failed! Role does not exist = " + req.body.roles[i]
                });
                return;
            }
        }
    }

    next();
}

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkRolesExisted: checkRolesExisted
}

module.exports = verifySignUp;