const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friends = new Schema({
    requester: { type: Schema.Types.ObjectId, ref: 'User' },
    requesterName: { type: String },
    recipient: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    }
})


const friendsModel = mongoose.model("Friends", friends);
module.exports = friendsModel;