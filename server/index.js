const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = 8080;
const fs = require("fs");
const path = require("path");
var cors = require("cors");

const { addUser, getUser, getData, addData } = require('./mongodb/mong');
const axios = require('axios');
//const { get } = require("http");

const crypto = require("crypto");
//creating salt of a-z-A-Z-0-9 with 30 characters
// const salt = [...Array(30)].map((e) => ((Math.random()*36)|0).toString(36)).join("");
// console.log(salt);
// var hash = crypto.createHash("sha256").update(salt+"password").digest('base64');
// console.log(hash);
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
});


app.post("/checkPassword", (req, res) => {
    console.log("check Password "+ req.body);
    const { email, password } = req.body;
    try{
        getUser(email).then((data)=>{
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




////my key de281dbb-1445-4ce3-b6fc-997c205e560b
//https://www.dictionaryapi.com/api/v3/references/collegiate/json/voluminous?key=your-api-key


app.get("/dictionary/getData", (req, res) => {
    try {
        const keyword = req.query.keyword;
        console.log(keyword);
        getData(keyword).then((data) => {
            //you will get an error if you json parse in here there is no need for that 
            //const d = JSON.parse(data);
            console.log("data is >>>>", data);
            if(Object.keys(data).length < 1){
                console.log("yes less than 1>>>>");
                try{
                    apiGet(keyword).then(object =>{
                        if(Object.keys(object).length>0){
                            //I had to wait for the db to add the data first then making the response
                            addData(object).then(d => {
                                res.status(200).json(object);
                            });
                        }else{
                            console.log("empty object");
                            res.status(200).json({});
                        }
                    }).catch(err =>{
                        res.status(404).send("Something went wrong");
                    });
                }
                catch(err){
                    res.status(404).send("Something went wrong");
                }

            }else{
                console.log("sent from mongodb");
                res.status(200).json(data);
            }
        }).catch(err => {
            console.log("calling from catch",err);
            try {
                apiGet(keyword).then(object => {
                    if (Object.keys(object).length > 0) {
                        addData(object).then(() => {
                            res.status(200).json(object);
                        });
                    } else {
                        res.status(200).json({});
                    }
                }).catch(err => {
                    res.status(404).send("Something went wrong");
                });
            }
            catch (err) {
                res.status(404).send("Something went wrong");
            }
        });
    }
    catch (err) {
        res.status(404).send("Something went wrong");
    }
});

//todo
app.post("/addData", (req, res) => {
    console.log("here " + req.body);
    //const { keyword, imageLink } = req.body;
    //const salt = [...Array(30)].map((e) => ((Math.random() * 36) | 0).toString(36)).join("");
    //console.log(salt);
    //const hash = crypto.createHash("sha256").update(salt + password).digest('base64');
    //const obj = { "email": email, "salt": salt, "hash": hash };
    //console.log(obj);
    addUser(req.body).then((response) => {
        res.send(JSON.stringify({ state: response }));
        console.log("data added");
    }).catch(err => {
        res.send(err);
    });
});

const apiKey = "de281dbb-1445-4ce3-b6fc-997c205e560b";
async function apiGet(keyword){
    return new Promise(async (resolve, reject)=>{
        console.log("fetching api data");
        const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${keyword}?key=${apiKey}`;
        await axios.get(url).then(res => {
            //console.log(res.data[0]);
            if (res.data[0]){
                var shortdef = res.data[0].shortdef;
                var artid = "%";
                var capt = "no caption";
                if (res.data[0].hasOwnProperty("art")) {
                    artid = res.data[0].art.artid;
                    capt = res.data[0].art.capt;
                }
                const obj = { "keyword": keyword, "shortdef": shortdef, "artid": artid, "caption": capt };
                console.log(obj);
                resolve(obj);
            }else{
                reject("err");
            }

        }).catch(err => {
            console.log(err);
   
        });
    });

} 