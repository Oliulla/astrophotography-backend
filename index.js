const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
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

function verifyJWT(req, res, next) {
  // console.log(req.headers.authorization);
  const authHeader = req.headers.authorization;
  if(!authHeader) {
    return res.status(401).send({message: 'unauthorized access'});
  }
  const token = authHeader.split(' ')[1]
  jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded) {
    if(err) {
      return res.status(401).send({message: 'unauthorized access'});
    }

    req.decoded = decoded;
    next();
  })
}

// check database connection
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
// response jwt token
try {
  app.post("/jwt", (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
      expiresIn: "30d",
    });
    res.send({ token });
  });
} catch (error) {
  console.log(err);
}

// add services in db
try {
  app.post("/services", async (req, res) => {
    const result = await serviceCollenction.insertOne(req.body);
    if (result.acknowledged) {
      res.json({
        status: true,
        message: "service inserted successfully",
      });
    } else {
      res.json({
        status: false,
        message: "service inserted failed",
      });
    }
  });
} catch (error) {
  res.json({
    status: false,
    message: error.message,
    data: null,
  });
}

try {
  // send only 3 services from serviceCollection
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
  // send all services from serviceCollection
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
  // send single service
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
    if (result.acknowledged) {
      res.json({
        status: true,
        message: "data inserted successfully",
      });
    } else {
      res.json({
        status: false,
        message: "data inserted failed",
      });
    }
  });
} catch (error) {
  res.json({
    status: false,
    message: error.message,
    data: null,
  });
}

// send all users review
try {
  app.get("/reviews", verifyJWT, async (req, res) => {
    
    const decoded = req.decoded;
    console.log("inside", decoded)

    if(decoded.email !== req?.query?.email) {
      res.status(403).send({message: "unauthorizad forbidden"})
    }

    let query = {};
    const userEmail = req?.query?.email;
    if (userEmail) {
      query = {
        userEmail
      };
    }
    const cursor = usersReviewCollection.find(query);
    const reviews = await cursor.toArray();

    res.json({
      status: true,
      message: "data got successfully",
      data: reviews,
    });
  });
} catch (error) {
  res.json({
    status: false,
    message: error.message,
    data: null,
  });
}

// send single review response
try {
  app.get("/reviews/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };

    const review = await usersReviewCollection.findOne(query);

    res.json({
      status: true,
      message: "data got successfully",
      data: review,
    });
  });
} catch (error) {
  res.send({
    status: false,
    message: "data got failed",
  });
}

// update user review text
app.put("/reviews/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedReview = req.body;
    console.log(updatedReview);
    const result = await usersReviewCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: updatedReview }
    );

    res.json({
      status: true,
      message: "updated successfully",
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      error: "Update failed",
    });
  }
});

// delete specific review
try {
  app.delete("/reviews/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await usersReviewCollection.deleteOne(query);
    console.log(result);
    if (result.deletedCount) {
      res.json({
        status: true,
        message: "Successfully deleted one document",
        data: result,
      });
    } else {
      res.json({
        status: false,
        message: "No documents matched the query. Deleted 0 documents",
      });
    }
  });
} catch (error) {
  res.send({
    status: false,
    message: "delete review failed",
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
