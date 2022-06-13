const mongo = require('mongoose');
const config = require('config');
const { default: mongoose } = require('mongoose');

const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true
        });

        console.log('MongoDB connected...')
    } catch(err) {
        console.log(err.message);
        // Exit process with faliure
        process.exit(1);
    }
}

module.exports = connectDB;