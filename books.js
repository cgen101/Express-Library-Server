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
}, { versionKey: false });



BookSchema.virtual("IDandTitle")
    .get(function () {
        return { id: this.id, title: this.title };
    })
    .set(function (v) {
        this.set({ id: v.id, title: v.title });
    });

module.exports = model('Books', BookSchema);