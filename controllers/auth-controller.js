const config = require('../config');
const users = require('../data/users.json');
const roles = require('../data/roles.json');

let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');

exports.register = (req, res) => {
    const userToRegister = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        roles: []
    }

    users.push(userToRegister);

    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            const role = roles.find(r => r.name === req.body.roles[i]);

            if (role) {
                userToRegister.roles.push(role);
                res.send({message: "User was registered successfully!"});
            }
        }
    } else {
        userToRegister.roles.push("standard");
        res.send({message: "User was registered successfully!"});

    }
}

exports.login = (req, res) => {
    const user = users.find(u => u.username === req.body.username);

    if (!user) {
        return res.status(404).send({message: "User Not found."});
    }

    let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
    );

    if (!passwordIsValid) {
        return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
        });
    }

    let token = jwt.sign({id: user.id}, config.secret, {
        expiresIn: 86400 // 24 hours
    });

    let authorities = [];
    for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
    }
    res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
    });
}

