const express = require("express");
const cors = require('cors')
const passport = require("passport");
const LocalStrategy =  require("passport-local").Strategy;
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');
const session = require('express-session')
const bodyParser = require('body-parser');
const sqlite3 = require("sqlite3");
const querystring = require('querystring');
const cron = require('node-cron');
const axios = require('axios');
const { CLIENT_RENEG_WINDOW } = require("tls");

const app = express();

//Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}))

app.use(cookieParser("secret"))


app.use(passport.initialize());
app.use(passport.session())

var db = new sqlite3.Database('./test.db')

passport.serializeUser(function(user, done) {
    done(null, user.username);
  });
  
passport.deserializeUser(function(id, done) {
    const sqlSearch = `SELECT * FROM userLogin WHERE username = ?;`
    db.get(sqlSearch, [id], (err,row) => {
        done(null, row)
    })
});

passport.use(new LocalStrategy(
    function(username, password, done){
        const sqlSearch = `SELECT * FROM userLogin WHERE username = ?;`
        db.get(sqlSearch,[username], (err,row) => {
            // user isn't found in database
            if(row == null){ return done(null, false, { message: "No user with that email"})} 
            else{  // we found user in database
                bcrypt.compare(password, row.password, function(err,result){
                    if(result){ // password matches
                        return done(null, row)
                    }
                    else{
                        return done(null, false, {message: "Password inccorect"})
                    }
                })
            } 
        });
    }
));


app.post('/login', passport.authenticate('local'), (req, res) => {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.send("Logged in")
});

app.post('/register', (req,res) =>{
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;

    console.log("RECIEVED: ",name, username, password, " from register")

    // search to see if user already exists in databsae
    const sqlSearch = `SELECT * FROM userLogin WHERE username = ?;`

    db.get(sqlSearch, [username], (err, row) => {
        if(row!=null){   // user already exists
            console.log("user already exists")
            res.send("user already exists") 
        }else{          // user doesn't exist so we add to database
            bcrypt.hash(password, 10, function(err, hash){
                if(err){
                    console.log(err)
                    return res.sendStatus(500)
                }

                console.log("Created hash: ",hash)
                // `INSERT INTO userLogin(name, username, password) VALUES(?,?,?)`, [name, username, hash]
                // const sqlQuery = `INSERT INTO userLogin(name, username, password) VALUES("${name}", "${username}", "${hash}");`
                db.run(`INSERT INTO userLogin(name, username, password) VALUES(?,?,?)`, [name, username, hash])
                db.run(`INSERT INTO youtubeUserInfo(username) VALUES(?)`, [username])

                const user = { "username": username, "password":hash, "name": name}

                req.login(user, (err) => {
                    if(err){ return res.send(err)}
                    else{ return res.send("Success")}
                });
            });
        }
    });
});

app.post('/user', (req,res) => {
    if (req.isAuthenticated()) {
        res.send(req.user)
    }else{
        res.send("Cookie is invalid" )
    }
})


app.post('/logout', (req,res) => {
    req.logout();
    res.send("success");
})

app.post('/edit_name', (req,res) => {
    const curr_user = req.user.username
    const updated_name = req.body.name 

    // const update_name_query = `UPDATE userLogin SET name= "${updated_name}" WHERE username ="${curr_user}";`
    db.run(`UPDATE userLogin SET name=? WHERE username = ?`, [updated_name, curr_user], (err) => {
        if (err) { } // do something
        else{

            const user = { password: req.user.password, name: updated_name, username: req.user.username }
            req.logOut()

            req.login(user, (err) => {
                if(err){ return res.send(err)}
                else{ return res.send("Success")}
            })
        }
    })

})

app.post('/edit_username', (req,res) => {
    const current_user = req.user.username
    const updated_username = req.body.name

    const checkUsernameExist = `SELECT * FROM userLogin WHERE username=?;`
    //console.log(checkUsernameExist)
    db.get(checkUsernameExist, [updated_username], (err, row) => {

        if (err) { } // do something idk yet 
        else{
            if(row){
                res.send("Username already exists try another one")
            }
            else{
                // const update_username_query = `UPDATE userLogin SET username = "${updated_username}" WHERE username ="${current_user}";`
                db.run(`UPDATE userLogin SET username = ? WHERE username = ?`, [updated_username, current_user])

                // const update_username_inSpotify = `UPDATE spotifyData SET username = "${updated_username}" WHERE username ="${current_user}";`
                db.run(`UPDATE spotifyData SET username = ? WHERE username = ?`, [updated_username, current_user],  (err) => {
                    if(err){
                        console.log(err)
                    }
                })

                const user = { "username": updated_username, "password": req.user.password, "name": req.user.name}
                req.logOut();

                req.login(user, (err) => {
                    if(err){ return res.send(err)}
                    else{ return res.send("Success")}
                })    
            }
        }
    })
})

app.post('/edit_password', (req,res) => {
    const current_user = req.user.username
    const updated_password = req.body.password
    bcrypt.hash(updated_password, 10, function(err, hash){
        if(err){
            console.log(err)
            return res.sendStatus(500)
        }
        console.log("hashing password:", updated_password, "Created hash: ",hash)
        // const update_password_query = `UPDATE userLogin SET password = "${hash}" WHERE username ="${current_user}";`
        db.run(`UPDATE userLogin SET password = ? WHERE username = ?`, [hash, current_user],  (err) => {
            if(err) { }
            else{
                const user = { name: req.user.name, username: req.user.username, password: hash}

                req.logOut();

                req.login(user, (err) => {
                    if(err){ return res.send(err)}
                    else{ return res.send("Success")}
                }) 
            }
        })
    });
})

app.post('/delete_user', (req,res) => {
    const current_user = req.user.username
    const delete_user_query = `DELETE FROM userLogin WHERE username="${current_user}";`
    db.run(delete_user_query)
    req.logout()
    res.send("sucess")
})

app.post('/spotifyInit', (req, res) => {

    const user = req.user.username
    const access_token = req.body.access_token
    const refresh_token = req.body.refresh_token 

    // const spotifyInit = `INSERT INTO spotifyData (username, access_token, refresh_token) VALUES("${user}", "${access_token}", "${refresh_token}");`

    db.run(`INSERT INTO spotifyData (username, access_token, refresh_token) VALUES(?, ?, ?)`, [user, access_token, refresh_token], (err) => {
        if(err){
            res.send(err)
        }
        else{
            res.send("Success")
        }
    })
})

app.get("/spotify_accessToken", (req, res) => {

    const getToken = `SELECT * FROM spotifyData WHERE username="${req.user.username}"`
    db.get(getToken, (err, row) => {
        if(row){
            res.send(row.access_token)
        }
        else{
            console.log(err)
            if(err){
                res.send("Error")
            }
            else{
                res.send("Error")
            }
        }
    })
})

cron.schedule("*/60 * * * *", () => {
    const getAllUsers = `SELECT * FROM spotifyData;`

    console.log("getting users")

    
    const clientId = "426327bb47284651ba7d3aac5790edc1";
    const clientSecret = "e418005aab42495587ced18596035912";
    const headers = {
        headers:{
          Authorization: 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64')
        }
    }

    db.all(getAllUsers, (err,rows) => {

        if(err){
            return;
        }

        rows.forEach( row => {
            refreshToken = row.refresh_token;

            let data = {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            };

            axios.post("https://accounts.spotify.com/api/token", querystring.stringify(data), headers).then( res => {

                console.log("Current username: " + row.username)

                const updateRefresh = `UPDATE spotifyData SET access_token = "${res.data.access_token}" WHERE username = "${row.username}"`;
                console.log(updateRefresh)
                db.run(updateRefresh, err => {
                    if(err){
                        console.log("database error: " + err)
                    }
                }) 
            }).catch(err => {
                console.log("Axios error " + err)
            })
        })
    })
})

// Search Section

app.get("/youtube_playlist_search", (req, res) => {

    // db.get(`SELECT username FROM youtubeUserInfo WHERE username="floop";`, (err, row) => {
    //     if(row){
    //         // var song_list;
    //         // var artist_list
    //         // db.get(`SELECT * FROM youtubeSongs WHERE playlist_id="?"`, [row.playlist_id], (err, row) => {
    //         //     if(err){
    //         //         res.send(err);
    //         //     }
    //         //     else{
    //         //         song_list = row.song_name;
    //         //         artist_list = row.artist_name;
    //         //     }
    //         // });
    //         // res.send(row.username)
    //     }
    //     else{
    //         console.log(err)
    //         if(err){
    //             res.send(err)
    //         }
    //         else{
    //             res.send("Error")
    //         }
    //     }
    // })
})

app.listen(5000, () => {
    console.log("WELCOME TO MY FINAL WEBSITE wowoowoo")
})