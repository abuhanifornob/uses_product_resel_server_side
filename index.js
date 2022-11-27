const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { query } = require('express');
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.t90v0gz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    console.log("Inside verify Jwt Token", req.headers.authorization);
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send("unauthorized Access");
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded) {
        if (err) {
            return res.status(403).send({ message: "Forbidden Access" });
        }
        req.decoded = decoded;
        next();
    })
}

async function run() {
    try {
        const usesProductsCategoryColletions = client.db('usesProductsSeller').collection("productsCategory");
        const productsCollection = client.db('usesProductsSeller').collection("products");
        const bookingCollection = client.db('usesProductsSeller').collection("booking");
        const usersCollection = client.db('usesProductsSeller').collection("users");

        app.get("/productsCategory", async(req, res) => {
            const query = {}
            const result = await usesProductsCategoryColletions.find(query).toArray();
            res.send(result);
        });
        app.get("/products/:name", async(req, res) => {
            const name = req.params.name;
            const query = { productCategory: name }
            const result = await productsCollection.find(query).toArray();
            res.send(result);


        });

        app.post("/booking", async(req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);

        });
        app.get("/booking", verifyJWT, async(req, res) => {
            const email = req.query.email;
            const query = { buyerEmail: email }
            const result = await bookingCollection.find(query).toArray();
            res.send(result)
        });

        app.get("/jwt", async(req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);

            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
                return res.send({ accessToken: token });
            }
            res.status(403).send({ accessToken: " " });

        })

        app.post("/users", async(req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);

        });



    } finally {}

}

run().catch(console.error);




app.get("/", (req, res) => {
    res.send("Uses prosucts Seler Sever is Running")
});
app.listen(port, () => {
    console.log(`Uses Product Seler Server running is Port ${port}`);
})