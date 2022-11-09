const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
const usersReviewCollection = database.collection("usersReview");


// endpoints
// add services in db
try {
  app.post('/services', async(req, res) => {
    const result = await serviceCollenction.insertOne(req.body);
    res.json({
      status: true,
      message: "service inserted successfully",
    });
    console.log(result)
  });
} catch (error) {
  res.json({
    status: false,
    message: error.message,
    data: null,
  });
}


try {
  // get only 3 services from serviceCollection
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
  // get all services from serviceCollection
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

try {
  // get single service
  app.get("/service/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };

    const service = await serviceCollenction.findOne(query);
    res.json({
      status: true,
      message: "data got successfully",
      data: service,
    });
  });
} catch (error) {
  res.json({
    status: false,
    message: error.message,
    data: null,
  });
}

// post users reviews
try {
  app.post("/reviews", async (req, res) => {
    const result = await usersReviewCollection.insertOne(req.body);
    res.json({
      status: true,
      message: "data inserted successfully",
    });
  });
} catch (error) {
  res.json({
    status: false,
    message: error.message,
    data: null,
  });
}

// get users reviews
try {
  app.get('/reviews', async(req, res) => {
    // const { id } = req.params;
    // console.log(id)
    const cursor = usersReviewCollection.find({});
    const reviews = await cursor.toArray();

    res.json({
      status: true,
      message: "data got successfully",
      data: reviews,
    });
  })
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
