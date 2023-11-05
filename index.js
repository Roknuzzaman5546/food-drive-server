const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

// assingment11user
// i8BQWxeurxTMw70z

const uri = "mongodb+srv://assingment11user:i8BQWxeurxTMw70z@cluster0.m8ywqwd.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const foodcollection = client.db("foodcollection").collection("foods")

        app.post('/foods', async(req, res) =>{
            const foods = req.body;
            console.log(foods)
            const result = await foodcollection.insertOne(foods)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Food donat site is running')
})

app.listen(port, () => {
    console.log(`food donat port site running out ${port}`)
})