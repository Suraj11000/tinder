const { UserModel } = require("../models/user");
const { ConnectionRequestSchema } = require("../models/connection");

exports.SendRequest = async (req, res) => {
  try {
    const { _id } = req.user;
    const status = req.params.status;
    const toUserId = req.params.id;
    const allowedStatus = ["interested", "ignore"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).send("invalid status provided.");
    }

    const user = await UserModel.findById(toUserId);

    if (!user) {
      return res.status(404).send("user not found with this id : " + toUserId);
    }

    const existingRequest = await ConnectionRequestSchema.findOne({
      $or: [
        { fromUserId: _id, toUserId },
        { fromUserId: toUserId, toUserId: _id },
      ],
    });

    if (existingRequest) {
      return res.status(400).send("request sended alredy.");
    }

    const addConnectionRequest = await ConnectionRequestSchema.create({
      fromUserId: _id,
      toUserId,
      status,
    });

    if (!addConnectionRequest) {
      return res.status(400).send("error creating request");
    }

    return res.json({
      message: `connection request ${status} successfully`,
      data: addConnectionRequest,
    });
  } catch (err) {
    return res.status(500).send("error :" + err.message);
  }
};

exports.ReviewRequest = async (req,res) => {
  try{
    const userId = req.user._id
    const status = req.params.status
    const requestId = req.params.requestId
    console.log(userId, status, requestId, "thsi is the data")
    const allowedStatus = ["accecpted", "rejected"]
    if(!allowedStatus.includes(status)){
      return res.status(500).send("invalid status")
    }

    const isRequestIdPresent = await ConnectionRequestSchema.findOne({
      _id : requestId,
      toUserId : userId,
      status : "interested"
    })

    if(!isRequestIdPresent){
      return res.status(400).send("no request with this id")
    }

    const updateStatus = await ConnectionRequestSchema.findByIdAndUpdate(requestId, {status})

    if(!updateStatus){
      return res.status(400).send("error updating the status")
    }

    return res.status(200).json({
      message : `Request ${status} successfully.`
    })
  }catch(err){
    return res.status(500).send("Error : " + err.message)
  }
}