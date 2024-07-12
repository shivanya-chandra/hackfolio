const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reqString = {
    type: String,
    required: true
}

const chatSchema = new Schema({
    senderID: reqString,
    receiverID: reqString,
    message: reqString,
    senderName: reqString
},
    { timestamps: true }
)


const chatModel = mongoose.model("Chat", chatSchema);
module.exports = chatModel;