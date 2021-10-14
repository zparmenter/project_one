
require("dotenv").config();
const express = require('express');
const methodOverride = require('method-override');
const session = require("express-session");
const MongoStore = require("connect-mongo");
// Global variables
const PORT = process.env.PORT;
const controllers = require("./controllers");

// Run my express dependency
const app = express();

/* == App configs == */
app.set('view engine', 'ejs');

/* == middlewares == */
app.use(express.static('public'))

app.use(
    session(
        {
            store: MongoStore.create({mongoUrl: process.env.MONGOURL}),
            secret: "super secret",
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 2,
            },
        }
    )
);

app.use(function (req, res, next) {
    
    res.locals.user = req.session.currentUser;
    next();

});

/* = this should be near the top, above the routes == */
app.use(express.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

/* == use controllers == */
app.use("/all-books", controllers.book);
app.use("/", controllers.user);


// Routes
app.get("/", async function (req, res) {
    res.render("home");
});


app.get("/*", (req, res) => {
    const context = { error: req.error };
    return res.status(404).render("404", context);
});

app.listen(PORT, () => console.log(`Listening for client requests on port ${PORT}`));

