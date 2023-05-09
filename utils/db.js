const MongoClient = require("mongodb").MongoClient;

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

let cachedDb = null;

async function getDbCollection(collectionName) {
  if (cachedDb) {
    return cachedDb.collection(collectionName);
  }

  const mongoClient = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await mongoClient.connect();
    const db = mongoClient.db(MONGODB_DB_NAME);
    cachedDb = db;
    return db.collection(collectionName);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = getDbCollection;
