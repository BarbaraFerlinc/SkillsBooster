const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

// Routers
const domenaRouter = require('./routes/domenaRouter');
const kvizRouter = require('./routes/kvizRouter');
const podjetjeRouter = require('./routes/podjetjeRouter');
const uporabnikRouter = require('./routes/uporabnikRouter');
const vprasanjeRouter = require('./routes/vprasanjeRouter');
const znanjeRouter = require('./routes/znanjeRouter');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Routers' use
app.use('/domena/', domenaRouter);
app.use('/kviz/', kvizRouter);
app.use('/podjetje/', podjetjeRouter);
app.use('/uporabnik/', uporabnikRouter);
app.use('/vprasanje/', vprasanjeRouter);
app.use('/znanje/', znanjeRouter);

app.listen(process.env.PORT || 9000, () => {
    console.log("Strežnik na portu " + 9000);
});

module.exports = app;
