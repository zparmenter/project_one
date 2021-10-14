const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");

const {
    Book, 
    Review,
    User, 
}= require("../models");

/*-------------NEW USER ROUTE-------------*/
router.get("/new-user", function (req, res) {
    res.render('newUser.ejs');
});


router.post("/new-user", async function (req, res) {
    try {
        const foundUser = await User.exists({username: req.body.username});

        if (foundUser) {
            console.log("Account already exists");
            return res.redirect("/login");
        }

        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(req.body.password, salt);

        req.body.password = hash;

        const newUser = await User.create(req.body);
        console.log(newUser);

        return res.redirect("/login");
    } catch (error) {
        console.log(error);
        return res.send(error);
    }
});

//show reviews on page
router.get("/login/:id", async function (req, res, next) {
    try {
        
        const user = await User.findById(req.params.id)
        console.log('this is the user: ', user);
        const reviews = await Review.find({user: req.params.id}).populate("user");
        console.log('this is the review', reviews);
        // const book = await User.findById(req.params.id);
        

        const book_log = [];
        const book = [];

        for (let i = 0; i <= reviews.length - 1; i++) {
            book_log[i] = reviews[i].user;
            book[i] = await Review.find({user: book_log[i]}).populate("book"); 
        }
        console.log('this is the book', book);

        const context = {
            user,
            reviews,
            book,
        };

        return res.render("./users/showUser", context);

    } catch (error) {
        return console.log(error);
    }
});

//login index page
router.get("/login", function (req, res) {
    res.render("users/login");
});

router.post("/login", async function (req, res) {
    try {
        const foundUser = await User.findOne({username: req.body.username});
        console.log(`foundUser object is ${foundUser}`);

        if (!foundUser) return res.redirect("/new-user");

        const match = await bcrypt.compare(req.body.password, foundUser.password);
        
        if (!match) return res.send("The supplied username or password is incorrect.");

        req.session.currentUser = {
            //originally - "id: foundUser._id"
            _id: foundUser._id,
            username: foundUser.username,
        };

        console.log(`Current User: ${req.session.currentUser}`);
        console.log(`Current User unique id: ${req.session.currentUser._id}`);
        return res.redirect(`/login/${req.session.currentUser._id}`);

    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

/*-------show route-----------*/
router.get(`/login/:id`, (req, res, next) => {
    User.findById( req.params.id, (error, foundUser) => {
        
        if(error) {
            return console.log(error);
            req.error = error
            return next();
        }

        const context = {
            user: foundUser,
        }
        
        res.render('./users/showUser', context);
    });
});

router.get("/logout", async function (req, res) {
    try {
    
        await req.session.destroy();
        return res.redirect("/");

    } catch (error) {
        console.log(error);
        return res.send(error);
    }
});

module.exports = router;