const mongoose = require('mongoose')
const ConnectDb = async () => {
    await mongoose.connect('mongodb+srv://surajshindecs_db_user:6F2GsMt2YdXqeLSI@cluster0.zv4qq5j.mongodb.net/')
}

module.exports = ConnectDb