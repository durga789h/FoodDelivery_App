const mongoose = require('mongoose');

const MONGODB_URL = process.env.MONGODB_URL;

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    };
}

exports.connectToDatabase = async () => {
    if (cached.conn) return cached.conn;
    if (!MONGODB_URL) throw new Error('MONGODB_URL is not defined');
    cached.promise = cached.promise || mongoose.connect(MONGODB_URL, { dbName: "resto-project", bufferCommands: false });

    cached.conn = await cached.promise;
    return cached.conn;
};

