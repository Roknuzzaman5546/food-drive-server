const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')
require('dotenv').config();
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors({
    origin: [
        'http://localhost:5173'
    ],
    credentials: true
}));
app.use(express.json())
app.use(cookieparser())

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
        const foodrequestcollection = client.db('foodcollectiondb').collection('requestcollection')

        app.post('/jwt', async (req, res) => {
            const user = req.body;
            console.log("token res", user)
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                })
                .send({ success: true })
        })

        app.get('/foods', async (req, res) => {
            const cursor = foodcollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodcollection.findOne(query)
            res.send(result)
        })

        app.post('/foods', async (req, res) => {
            const foods = req.body;
            const result = await foodcollection.insertOne(foods)
            res.send(result)
        })

        app.get('/requestfoods', async (req, res) => {
            const cursor = foodrequestcollection.find()
            const result = await cursor.toArray();;
            res.send(result)
        })

        app.post('/requestfoods', async (req, res) => {
            const requestedfoods = req.body;
            const result = await foodrequestcollection.insertOne(requestedfoods)
            res.send(result)
        })

        app.get('/requestfoods/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await foodrequestcollection.findOne(filter)
            res.send(result)
        })

        app.put('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatefoods = req.body;
            const updates = {
                $set: {
                    donaremail: updatefoods.donaremail,
                    donarname: updatefoods.donarname,
                    donarphoto: updatefoods.donarphoto,
                    foodphoto: updatefoods.foodphoto,
                    foodname: updatefoods.foodname,
                    foodquantity: updatefoods.foodquantity,
                    pickuplocation: updatefoods.pickuplocation,
                    expiredtime: updatefoods.expiredtime,
                    additionalnotes: updatefoods.additionalnotes,
                }
            }
            const result = await foodcollection.updateOne(filter, updates, options)
            res.send(result)
        })

        app.put('/requestfoods/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatestatus = req.body;
            const updatesrequest = {
                $set: {
                    status: updatestatus.status
                }
            }
            const result = await foodrequestcollection.updateOne(filter, updatesrequest, options)
            res.send(result)
        })

        app.delete('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await foodcollection.deleteOne(filter)
            res.send(result)
        })

        app.delete('/requestfoods/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await foodrequestcollection.deleteOne(filter)
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