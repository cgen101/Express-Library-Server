const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const BookSchema = new mongoose.Schema({
    id: { type: String },
    title: { type: String},
    author: { type: String}, 
    published: { type: String },
    isbn: { type: String},
    avail: { type: Boolean},
    who: { type: String },
    due: { type: String}
});

BookSchema.virtual("IDandTitle")
.get( function () {
return this.id + ", " + this.title;
} )
.set( function (v) {
const i = v.indexOf(' ');
const id = v.substring(0,i);
const title = v.substring(i+1);
this.set( {id,title});
} )

module.exports = model('Books', BookSchema);