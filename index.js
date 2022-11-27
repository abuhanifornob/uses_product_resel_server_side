const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { query } = require('express');

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.t90v0gz.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

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
            console.log(name);

        });

        app.post("/booking", async(req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);

        });
        app.get("/booking", async(req, res) => {
            const email = req.query.email;
            console.log(email);
            const query = { buyerEmail: email }
            const result = await bookingCollection.find(query).toArray();
            res.send(result)
        })
        app.post("/users", async(req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);

        })





    } finally {}

}

run().catch(console.error);




app.get("/", (req, res) => {
    res.send("Uses prosucts Seler Sever is Running")
});
app.listen(port, () => {
    console.log(`Uses Product Seler Server running is Port ${port}`);
})