const mongoose = require('mongoose');

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_LOCAL_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      autoIndex: false
    })
    .then(() => {
      console.log(`MongoDB Database connected with HOST: ${mongoose.connection.host}`);
    })
    .catch(error => {
      console.error(`MongoDB Connection Error: ${error}`);
    });
};

module.exports = connectDatabase;
