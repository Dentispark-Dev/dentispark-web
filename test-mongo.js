const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://dentispark_admin:dr346rrffe4578thj34@158.220.83.23:27017/dentispark?authSource=admin';

async function verifyMongo() {
    try {
        console.log("Attempting to connect to MongoDB...");
        const client = new MongoClient(url, { serverSelectionTimeoutMS: 5000 });
        await client.connect();
        console.log('Connected successfully to MongoDB server');
        await client.close();
    } catch (err) {
        console.error('Mongo connection error:', err.message);
    }
}

verifyMongo();
