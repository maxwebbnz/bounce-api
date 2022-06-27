/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
const express = require("express");
const cors = require("cors");
const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
});


app.get('/user', (req, res) => {
    return res.send('Received a GET HTTP method');
});

app.post('/users/:userId', (req, res) => {
    // undefined, body parser ignored this request
    // because of the content-type header
    req.body;
    res.json(req.body); // echo the result back
});

app.delete('/users/:userId', (req, res) => {
    return res.send(
        `DELETE HTTP method on user/${req.params.userId} resource`,
    );
});


app.post('/user', (req, res) => {
    return res.send('Received a POST HTTP method');
});

app.get("/createuser", (req, res) => {
    const newUser = User.build({
        name: "Max Webb",
        age: 18,
        email: "18205mw@hvhs.school.nz",
        verifedAge: true,

    });
    newUser.save();
    console.log('Jane was saved to the database!');

    res.json({ message: "Welcome to bezkoder application." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
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
    host: '45.77.236.119',
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

