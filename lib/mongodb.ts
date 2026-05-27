import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function getMongoClientPromise(): Promise<MongoClient> {
  if (!uri) {
    return Promise.reject(
      new Error("Missing MONGODB_URI. Add it to .env.local"),
    );
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  const client = new MongoClient(uri);
  return client.connect();
}

/** @deprecated Use getMongoClientPromise() — kept for MongoDBAdapter */
const clientPromise = uri
  ? getMongoClientPromise()
  : Promise.reject(new Error("Missing MONGODB_URI"));

export default clientPromise;

export async function getDb() {
  const client = await getMongoClientPromise();
  return client.db(process.env.MONGODB_DB_NAME || "plumber-guru");
}
