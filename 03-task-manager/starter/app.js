
const express = require("express");
const app = express();
const task = require("./routes/tasks");
const connectDB = require('./db/connect');
require('dotenv').config();
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


// middleware 
app.use(express.static('./public'));
app.use(express.json());

// routes
app.use('/api/v1/tasks',task);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
// const port = 3000

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URL);
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  start();


