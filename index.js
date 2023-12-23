const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware;
app.use(cors())
app.use(express.json());
//taskManagement
//kNk2yYlhEH6SUKZ4


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vh2cr5s.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
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
    // Send a ping to confirm a successful connection

    const alltaskcollection = client.db('taskdata').collection('tasksCollection')

    app.put('/tasksCollection/:taskId/status', async (req, res) => {
        try {
          const { taskId } = req.params;
          const { newStatus } = req.body;
  
          const result = await alltaskcollection.updateOne(
            { _id: new ObjectId(taskId) },
            { $set: { status: newStatus } }
          );
  
          res.send(result);
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
      });
  

    app.post('/tasksCollection',async(req,res)=>{
        const formData = req.body;
        const result = await alltaskcollection.insertOne(formData)
        res.send(result)

    })
    app.get('/tasksCollection',async(req,res)=>{
        const cursor = alltaskcollection.find();
        const result = await cursor.toArray(cursor)
        res.send(result);
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('task-management is running')
})
app.listen(port,()=>{
    console.log(`task-management is running on port : ${port}`)
})