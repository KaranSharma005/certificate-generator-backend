const mongoose = require("mongoose");
async function connectMongoDb(url)
{
    return mongoose.connect(url);
}
async function startServer() {
    try {
        await connectMongoDb("mongodb://localhost:27017/userLog");
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Failed");
    }
}
module.exports = {
    startServer,
}