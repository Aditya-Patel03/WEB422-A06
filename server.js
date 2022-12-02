/*********************************************************************************
*  WEB422 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: Patel Aditya Dharmesh Student ID: 143595205 Date: 12-20-2022
*
*  Vercel App (Deployed) Link: _____________________________________________________
*
********************************************************************************/ 

const express = require('express');
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const userService = require("./user-service.js");
const jwt = require('jsonwebtoken');

// JSON Web Token Setup
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

// Configure its options
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = '&0y7$noP#5rt99&GB%Pz7j2b1vkzaB0RKs%^N^0zOP89NT04mPuaM!&G8cbNZOtH';

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
//   console.log('payload received', jwt_payload);

  if (jwt_payload) {
    next(null, {
      _id: jwt_payload._id,
      userName: jwt_payload.userName      
    });
  } else {
    next(null, false);
  }
});

const HTTP_PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(cors());
passport.use(strategy);
app.use(passport.initialize);

app.post("/api/user/register", (req, res) => {
    userService.registerUser(req.body)
    .then((msg) => {
        res.json({ "message": msg });
    }).catch((msg) => {
        res.status(422).json({ "message": msg });
    });
});

app.post("/api/user/login", (req, res) => {
    userService.checkUser(req.body)
    .then((user) => {
        const payload = {
             _id: user._id,
             userName: user.userName
        };
        const token = jwt.sign(payload.env.secretOrKey);
        res.json({ "message": "login successful",token});
    }).catch(msg => {
        res.status(422).json({ "message": msg });
    });    
});

app.get("/api/user/favourites", 
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        userService.getFavourites(req.user._id)
        .then(data => {
            res.json(data);
        }).catch(msg => {
            res.status(422).json({ error: msg });
        })
    }
);

app.put("/api/user/favourites/:id", 
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        userService.addFavourite(req.user._id, req.params.id)
        .then(data => {
            res.json(data)
        }).catch(msg => {
            res.status(422).json({ error: msg });
        })
    }
);

app.delete("/api/user/favourites/:id", 
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        userService.removeFavourite(req.user._id, req.params.id)
        .then(data => {
            res.json(data)
        }).catch(msg => {
            res.status(422).json({ error: msg });
        })
    }
);

app.get("/api/user/history",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        userService.getHistory(req.user._id)
        .then(data => {
            res.json(data);
        }).catch(msg => {
            res.status(422).json({ error: msg });
        })
    }
);

app.put("/api/user/history/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        userService.addHistory(req.user._id, req.params.id)
        .then(data => {
            res.json(data)
        }).catch(msg => {
            res.status(422).json({ error: msg });
        })
    }
);

app.delete("/api/user/history/:id", 
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        userService.removeHistory(req.user._id, req.params.id)
        .then(data => {
            res.json(data)
        }).catch(msg => {
            res.status(422).json({ error: msg });
        })
    }
);

userService.connect()
.then(() => {
    app.listen(HTTP_PORT, () => { console.log("API listening on: " + HTTP_PORT) });
})
.catch((err) => {
    console.log("unable to start the server: " + err);
    process.exit();
});