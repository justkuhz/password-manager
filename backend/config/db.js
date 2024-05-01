// connect us to mongo db and log status

const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // on success
        console.log(`MongoDB Connected: ${connect.connection.host}`.cyan.underline);

    } catch (error) {
        // on fail
        console.log(`Error: ${error.message}`.red.bold);
        process.exit();
    }
};

module.exports = connectDB;