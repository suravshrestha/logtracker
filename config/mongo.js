const mongoose = require('mongoose')

//Connect Database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.Mongo_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })

  }
   catch (err) {
    console.error(err)
    process.exit(1)  
  }
}

module.exports = connectDB
