const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// mognodb admin
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.g9drewa.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function dbConnect() {
  try {
    await client.connect();
    console.log("database connected");
  } catch (err) {
    console.log(err.message);
  }
}
dbConnect();

// database and collections
const database = client.db("astroAdmin");
const serviceCollenction = database.collection("services");

// endpoints
try {
  // get only 3 data from serviceCollection
  app.get("/limitServices", async (req, res) => {
    const query = {};
    const cursor = serviceCollenction.find(query);

    const services = await cursor.limit(3).toArray();
    res.json({
      status: true,
      message: "data got successfully",
      data: services,
    });
  });
} catch (error) {
  res.json({
    status: false,
    message: error.message,
    data: null,
  });
}

try {
  // get all from serviceCollection
  app.get("/services", async (req, res) => {
    const query = {};
    const cursor = serviceCollenction.find(query);

    const allServices = await cursor.toArray();
    res.json({
      status: true,
      message: "data got successfully",
      data: allServices,
    });
  });
} catch (error) {
  res.json({
    status: false,
    message: error.message,
    data: null,
  });
}

// check starting server
app.get("/", (req, res) => {
  try {
    res.send({
      status: true,
      message: "server is ready to use",
    });
  } catch (error) {
    res.send({
      status: false,
      message: "server failed to response",
    });
  }
});

app.listen(port, () => {
  console.log("astrophotography server is running on ", port);
});
