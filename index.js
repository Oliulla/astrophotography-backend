const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());


// mognodb admin
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.g9drewa.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function dbConnect() {

    client.connect(err => {
        // check wheather db connect or not
        if(err) {
            console.log('database connected faild')
        }
        console.log('database connected');

        try {
            
        } catch (error) {
            
        }
    });
}
dbConnect();


// check starting server 
app.get('/', (req, res) => {
    try {
        res.send({
            status: true,
            message: 'server is ready to use'
        })
    } catch (error) {
        res.send({
            status: false,
            message: 'server failed to response'
        })
    }
})


app.listen(port, () => {
    console.log('astrophotography server is running on ', port)
})