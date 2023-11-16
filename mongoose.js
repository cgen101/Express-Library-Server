const mongoose = require("mongoose"); 
const mongoCS = "mongodb+srv://chloegentry:libraryDatabase@cluster0.k3xsof1.mongodb.net/LibraryDatabase"

const BooksData = require('./books')

mongoose.connect(mongoCS, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "MongoDB connection error:"));
connection.once("open", function() { console.log("connected"); });

