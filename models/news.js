import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const newsChema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  }
})

export default mongoose.model('News', newsChema)