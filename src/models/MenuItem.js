const { Schema, model } = require("mongoose");
const { imageSchema: Image } = require("./Image");

const menuItemSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: "No Description"
  },
  images: [Image]
});

const MenuItemModel = model("MenuItem", menuItemSchema);

module.exports = { menuItemSchema, MenuItemModel };
