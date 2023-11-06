const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m8ywqwd.mongodb.net/?retryWrites=true&w=majority`;

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
        const foodcollection = client.db('foodcollectiondb').collection("foods")

        app.get('/foods', async(req, res) =>{
            const cursor = foodcollection.find();
            const result = await cursor.toArray();
            res.send(result)    
        })

        app.get('/foods/:id', async (req, res) =>{
            const id = req.params.id; 
            const query = { _id : new ObjectId(id)}
            const result = await foodcollection.findOne(query)
            res.send(result)
        })

        app.post('/foods', async(req, res) =>{
            const foods = req.body;
            const result = await foodcollection.insertOne(foods)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Food donat site is running')
})

app.listen(port, () => {
    console.log(`food donat port site running out ${port}`)
})