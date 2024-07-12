const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reqString = { type: String, required: true };
const nonReqString = { type: String, required: false };
const nonReqArray = { type: Array, required: false };

const user = new Schema(
  {
    name: reqString,
    email: reqString,
    password: reqString,
    isConfirmed: {
      type: Boolean,
      required: true,
      default: false,
    },
    isMentor: {
      type: Boolean,
      required: true,
      default: false,
    },
    profileCreated: {
      type: Boolean,
      required: true,
      default: false,
    },
    isMentee: {

      type: Boolean,
      required: true,
      default: false,
    },
    isMentee: {
      type: Boolean,
      required: true,
      default: false,
    },
    friends: [{
      friendID: { type: Schema.Types.ObjectId, ref: 'User' },
      friendName: { type: String },
      acceptedStatus: { type: Boolean, default: false }

    }],
    requests: [{
      requestID: { type: Schema.Types.ObjectId, ref: 'User' },
      requestSender: { type: String },
      status: {
        type: String,
        enum: ['accepted', 'pending', 'rejected'],
        default: 'pending',
      }
    }],
    year: nonReqString,
    major: nonReqArray,
    minor: nonReqArray,
    college: nonReqString,
    residencyStatus: nonReqString,
    hometown: nonReqString,
    gender: nonReqString,
    country: nonReqString,
    state: nonReqString,
    professional: nonReqString,
    interests: nonReqArray,
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", user);
module.exports = userModel;
