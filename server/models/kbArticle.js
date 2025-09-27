const mongoose = require('mongoose');
const { Schema } = mongoose;

const KBArticleSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true }
});

module.exports = mongoose.model('KBArticle', KBArticleSchema);