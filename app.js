/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */

/**========================================================================
 * *                          API SERVICE
 *  ? Written by the Bounce team for the Bounce application
 *  ? This is the gateway between the client to the MYSQL Database
 *
 * * Currently only accessible in development enviroments, run by using
 * ?                        node app.js
 * SOF
 *========================================================================**/

/**=======================
 *     Base Declerations
 *========================**/
//* express
const express = require("express");
//* CORS for
const cors = require("cors");
//* express
const app = express();
//* for accepting HTTP requests.
const bodyParser = require('body-parser');

// use the body parser, with JSON, encoded extended
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// allow all origins.
app.use(cors({
    origin: '*'
}));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
    res.json({ message: "Bounce API - Welcome." });
});

/**==============================================
 *?                Routes
 *=============================================**/

//?users
app.get('/users', readAllUsers);
app.get('/users/:uid', readAUser);
app.post('/users/create', createAUser)
app.put('/users/update/:uid', updateAUser)

//?locations
app.get('/locations', readAllLocations)
app.get('/locations/:id', readALocation)
app.post('/locations/create', createALocation)
app.put('/locations/update/:id', updateALocation)

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
        return res.json({
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

/**==============================================
 **              updateAUser
 *?  What does it do? Update a users directory.
 *@return http response
 *=============================================**/
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




/**========================================================================
 **                           Locations API
 *========================================================================**/

/**==============================================
 **              readALocation
 *?  What does it do? Reads a location in the application database
 *@return http response
 *=============================================**/
async function readALocation(req, res) {
    let id = req.params.id
    Location.findByPk(id)
        .then((location) => {
            return res.status(200).json({ location })
        }).catch(err => {
            return res.status(400).json({ err })
        })
}

/**==============================================
 **              readAllLocations
 *?  What does it do? Reads all locations in the application, registered
 *@return http response
 *=============================================**/
async function readAllLocations(req, res) {
    Location.findAll({
        limit: 10,
        order: [['id', 'DESC']]
    }).then(location => {
        return res.json({
            location
        })
    }).catch(err => {
        return res.status(400).json({ err })
    })
}


/**==============================================
 **              createALocation
 *?  What does it do? Creates a location for the database
 *@return http response
 *=============================================**/
async function createALocation(req, res) {
    let { name, description, long, lat, createdBy } = req.body
    let newLocation = {
        name,
        description,
        long,
        lat,
        createdBy
    }
    Location.create(newLocation).then((user) => {
        return res.status(201).json({
            "message": "Location created successfully",
            newLocation
        })
    }).catch(err => {
        return res.status(400).json({ err })
    })
}
/**==============================================
 **              updateALocation
 *?  What does it do? Creates a location for the database
 *@return http response
 *=============================================**/
async function updateALocation(req, res) {
    let { name, description, long, lat, createdBy } = req.body
    let id = req.params.id

    let locationDataToChange = {
        name,
        description,
        long,
        lat,
        createdBy
    }
    Location.findOne({
        where: { id: id }
    }).then(location => {
        if (location) {
            location.update(locationDataToChange)
                .then((updatedLocation) => {
                    return res.status(202).json({
                        "message": "Location updated successfully",
                        updatedLocation
                    })
                })
        } else {
            return res.status(206).json({
                "message": "Location not found"
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

//
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    try {
        sequelize.authenticate();
        console.log('Connection has been established successfully.');
        User.sync();
        Location.sync();
        User.hasMany(Location, {
            foreignKey: 'locationId'
        });
        Location.belongsTo(User);

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
const Location = sequelize.define("Location", {
    // i.e. 'Muffin Break'
    name: {
        type: Sequelize.STRING,
    },
    // 'A store in the mall that sells mufins'
    description: {
        type: Sequelize.STRING,
    },
    // '41.0004'
    long: {
        type: Sequelize.STRING,
    },
    // '400.001'
    lat: {
        type: Sequelize.STRING,
    },
    // Max webb has an Id of 1 and is the owner of the location, therefore 1
    createdBy: {
        type: Sequelize.INTEGER,
    }
});

