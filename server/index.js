const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = 8080;
const fs = require("fs");
const path = require("path");
var cors = require("cors");

const { addUser, getUser } = require('./mongodb/mong');
//const { get } = require("http");

const crypto = require("crypto");
//creating salt of a-z-A-Z-0-9 with 30 characters
const salt = [...Array(30)].map((e) => ((Math.random()*36)|0).toString(36)).join("");
console.log(salt);
var hash = crypto.createHash("sha256").update(salt+"password").digest('base64');
console.log(hash);
// var hash3 = crypto.createHash("sha512").update("george").digest("base64");
// var hash1 = crypto.createHash('sha256').update("george").digest('hex');
// console.log(hash + " " + hash1 + " " + hash3);

app.use(bodyParser.urlencoded({ extended: false }));

//this is very importenet otherwise your post requests will not be able to parse the json contnet
app.use(bodyParser.json());

//when you use cors for the first time on any browser, the cross-origin will be enabled on the browser for this server
//even after removing the app.use(cors()), the browser will still recognize the server 
app.use(cors()); //that will make COR-enabled for all origins)

//app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
    console.log("http://localhost:8080/");
});




app.post("/addUser", (req, res) => {
    console.log("here "+ req.body);
    const { email, password } = req.body;
    const salt = [...Array(30)].map((e)=> ((Math.random()*36)|0).toString(36)).join("");
    console.log(salt);
    const hash = crypto.createHash("sha256").update(salt+password).digest('base64');
    const obj = {"email": email, "salt": salt, "hash": hash};
    console.log(obj);
    addUser(obj).then((response) => {
        res.send(JSON.stringify({state : response}));
        console.log("user added");
    }).catch(err =>{
        res.send(err);
    }); 
    // try {
    //     //let rawData = fs.readFileSync(path.resolve(__dirname, "users.json"));
    //     //let users = JSON.parse(rawData);


    //     //users.users.push(req.body)

    //     //console.log(books);
    //     //let toPut = JSON.stringify(users);
    //     //fs.writeFileSync(path.resolve(__dirname, "users.json"), toPut);
    //     //res.send(books);

    //     addUser(req.body).then((data) => {
    //         res.sendStatus(200).send(data);
    //         //console.log("user added");
    //     }).catch(err =>{
    //         res.sendStatus(404).send(err);
    //     }); 
    // }
    // catch (err) {
    //     res.sendStatus(404).send("User can't be added");
    //     console.log(err);
    // }

});


app.post("/checkPassword", (req, res) => {
    console.log("check Password "+ req.body);
    const { email, password } = req.body;

    //const obj = {"email": email, "salt": salt, "hash": hash};
    //console.log(obj);
    // addUser(obj).then((response) => {
    //     res.send(JSON.stringify({state : response}));
    //     console.log("user added");
    // }).catch(err =>{
    //     res.send(err);
    // });
    try{
        getUser(email).then((data)=>{
            //console.log("data ",data);
            //console.log("dataJson ",data.json());
            const { salt, hash } = data;
            const hashCompare = crypto.createHash("sha256").update(salt+password).digest('base64');
            if(hash === hashCompare){
                console.log("pass match");
                res.status(200).json({'pass':'true'});
            }
            else {
                console.log("no match");
                res.status(200).json({'pass':'false'});
            }
        }).catch(err =>{
            res.status(404).json({'pass': 'false'});
        });
    }
    catch(err){
        res.status(404).json({'pass': 'false'});
    }
});

app.post("/addIp", (req, res) => {
    try {
        let rawData = fs.readFileSync(path.resolve(__dirname, "users.json"));
        let users = JSON.parse(rawData);


        users.ipHistory.push(req.body)

        console.log(users.ipHistory);
        let toPut = JSON.stringify(users);
        fs.writeFileSync(path.resolve(__dirname, "users.json"), toPut);
        //res.send(books);
    }
    catch (err) {
        console.log(err);
    }

});

app.get("/getUser", (req,res)=>{
    try{
        const email = req.query.email;
        //mong get the user based on username
        //the username is the email and it must be unique
        //I can use google authentication here
        getUser(email).then((data)=>{
            
            res.status(200).json(data);

            //it does not matter if res.send() or res.json in fetch you have to to res.json() and then you get the data
            //res.json(data);
            //res.send(data);
        }).catch(err =>{
            res.status(404).send(err);
        });
        //res.send({df : `good id ${id}`});
    }
    catch(err){
        res.status(404).send("User not found");
        //console.log(err);
    }
});
