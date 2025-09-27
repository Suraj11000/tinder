const mongoose = require("mongoose");
const { Schema } = mongoose;

const ConnectionRequest = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User"
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User"
    },

    status: {
      type: String,
      enum: {
        values: ["accecpted", "interested", "rejected", "pending", "ignore"],
        message: `{VALUE} is not a valid status.`,
      },
      index : true
    },
  },
  {
    timestamps: true,
  }
);

// compound index
ConnectionRequest.index({fromUserId : 1, toUserId : 1})

// pre methods
ConnectionRequest.pre("save", function(next){
  const connection = this
  if(connection.fromUserId.equals(connection.toUserId)){
    throw new Error("Cannot send request to yourself.")
  }
  next()
})

const ConnectionRequestSchema = mongoose.model('connectionRequest', ConnectionRequest)
module.exports = {ConnectionRequestSchema}