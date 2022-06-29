/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');

var corsOptions = {
    origin: "http://localhost:8081"
};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
});

/**==============================================
 *?                Routes
 *=============================================**/
app.get('/users', readAllUsers);
app.get('/users/:uid', readAUser);
app.post('/users/create', createAUser)
app.put('/users/update/:uid', updateAUser)
/**==============================================
 **              readAUser
 *?  What does it do? Reads a user in the application, registered
 *@return http response
 *=============================================**/
async function readAUser(req, res) {
    let id = req.params.uid
    User.findByPk(id)
        .then((user) => {
            return res.status(200).json({ user })
        }).catch(err => {
            return res.status(400).json({ err })
        })
}

/**==============================================
 **              readAllUsers
 *?  What does it do? Reads all users in the application, registered
 *@return http response
 *=============================================**/
async function readAllUsers(req, res) {
    User.findAll({
        limit: 10,
        order: [['id', 'DESC']]
    }).then(users => {
        return res.status(200).json({
            users
        })
    }).catch(err => {
        return res.status(400).json({ err })
    })
}

/**==============================================
 **              createAUser
 *?  What does it do? Reads all users in the application, registered
 *@return http response
 *=============================================**/
async function createAUser(req, res) {
    let { name, email, age } = req.body
    let newUser = {
        name,
        email,
        age
    }
    User.create(newUser).then((user) => {
        return res.status(201).json({
            "message": "User created successfully",
            user
        })
    }).catch(err => {
        return res.status(400).json({ err })
    })
}
async function updateAUser(req, res) {
    let { name, email, age } = req.body
    let id = req.params.uid
    let userDataToChange = {
        name,
        email,
        age
    }
    User.findOne({
        where: { id: id }
    }).then(user => {
        if (user) {
            user.update(userDataToChange)
                .then((updateUser) => {
                    return res.status(202).json({
                        "message": "User updated successfully",
                        updateUser
                    })
                })
        } else {
            return res.status(206).json({
                "message": "User not found"
            })
        }
    }).catch(error => {
        return res.status(400).json({
            "error": error
        })
    })
}



// set port, listen for requests
const PORT = process.env.PORT || 8010;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    try {
        sequelize.authenticate();
        console.log('Connection has been established successfully.');
        User.sync();

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

//* Database

const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('bouncenz', 'api', 'alanmaxwilsonlovebounCe.1', {
    host: '104.248.156.41',
    dialect: 'mysql'
}
);
const User = sequelize.define("User", {
    name: {
        type: Sequelize.STRING,
    },
    age: {
        type: Sequelize.INTEGER,
    },
    email: {
        type: Sequelize.STRING,
    },
    profileType: {
        type: Sequelize.INTEGER,
    },
    verifedAge: {
        type: Sequelize.BOOLEAN,
    },
    profileImage: {
        type: Sequelize.STRING,
    },
    locationsCreated: {
        type: Sequelize.INTEGER,
    },
    eventsCreated: {
        type: Sequelize.INTEGER,
    },
});

