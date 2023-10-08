require('dotenv').config()

const connectDB = require('./db/connect')
const Jobs = require('./models/Job')

const mockData = require('./mock-data.json')

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    await Jobs.deleteMany()
    await Jobs.create(mockData)
    console.log('Success!!!!')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start();