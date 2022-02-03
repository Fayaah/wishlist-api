const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("custom-logger").config({level: 0});

// ================== set up ==================>
const app = express();
const port = process.env.PORT || 8080;

// ================== middlewares ==================>
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({origin: "http://localhost:8081"}));

app.get("/", (req, res) => {
    res.json({message: "Welcome to this app !"});
});

// ================== routes ==================>
// authentication
require('./routes/auth-routes')(app);

// ================== starting server ==================>
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});