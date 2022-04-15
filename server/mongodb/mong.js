const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = "mongodb+srv://gabdulaz:cico1mafterlight@georgecluster.nffzq.mongodb.net/cps530?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function addUser(obj){
    return new Promise( async (resolve, reject) =>{
        //console.log(obj);
        var res = '';
        try{
            await client.connect();
            client.db("cps530").collection("final").insertOne(obj).then( err =>{
                //console.log("added");
                client.close();
                resolve("success");
            });
        }
        catch(e){
            //console.log(e);
            reject(e);
        }
    });

}

async function getUser(email1) {
    return new Promise(async (resolve, reject)=>{
        try {
            await client.connect();
            //console.log(email1);
            // client.db("cps530").collection("final").find({ email: email1 }).toArray((err, result) => {
            //     const ret = result;
            //     console.log("from db "+ret);
            //     client.close();
            //     resolve(ret);
            // });

            client.db("cps530").collection("final").findOne({ email: email1 }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                const as = result;
                client.close();
                resolve(as);
            });
            
            // const answ = await client.db("cps530").collection("final").find({email: email1});
            // console.log(answ.toArray());
            //  if(answ){
            //     //const ret = result;
            //     console.log("from db " + answ);
            //     client.close();
            //     resolve(answ);
            // }
            // else{
            //     reject("no user");
            // }
        }
        catch (e) {
            //console.log(e);
            reject(e);
        }

    });

}

module.exports = {addUser, getUser};