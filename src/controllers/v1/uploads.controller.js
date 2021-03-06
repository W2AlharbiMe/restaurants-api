const uploadService = require("../../services/imageUpload");
const deleteService = require("../../services/imageDelete");
const { Image } = require("../../models/Image");
const Restaurant = require("../../models/Restaurant");
// need refactoring use s3 !
async function upload(request, response) {
  if (!request.files)
    return response.status(400).send({ message: "No Files Selected." });

  const { resource, target } = request.params;

  let images = request.files["images[]"];

  if (!images)
    return response.status(400).send({ message: "No Files Selected." });

  if (typeof images === "object") images = [images];

  switch (resource) {
    case "restaurants":
      const restaurant = await Restaurant.findById(target);

      if (restaurant) {
        const [result, paths] = uploadService(images);
        if (result) {
          paths.forEach(path => {
            const image = new Image(path);
            restaurant.images.push(image);
          });

          const updatedRestaurant = await restaurant.save();
          return response.send({
            message: "Uploaded Successfully",
            updatedRestaurant
          });
        }

        return response.status(400).send({ message: "Bad Request." });
      }

      return response.status(404).send({ message: `Restaurant Not Found.` });

    case "menu":
      const restaurants = await Restaurant.find();

      const data = restaurants.filter(r => r.menu.id(target))[0];

      const item = await data.menu.id(target);

      if (data) {
        const [result, paths] = uploadService(images);

        if (result) {
          paths.forEach(path => {
            const image = new Image(path);
            item.images.push(image);
          });

          const updatedItem = await data.save();
          return response.send({
            message: "Uploaded Successfully",
            updatedItem
          });
        }
      }

      return response.status(404).send({ message: `Item Not Found.` });

    default:
      return response
        .status(404)
        .send({ message: `Resource: ${resource} Not Found.` });
  }
}

async function destroy(request, response) {
  const { resource, target } = request.params;

  const { items } = request.body;

  if (!items)
    return response.status(400).send({ message: "items is required." });

  switch (resource) {
    case "restaurants":
      const restaurant = await Restaurant.findById(target);

      if (restaurant) {
        items.forEach(async item => {
          const image = await restaurant.images.id(item);

          if (image) {
            await deleteService(await image.remove());
          }
        });
        await restaurant.save();
        return response.send({ message: "Images Deleted!" });
      }

      return response.status(404).send({ message: "Restaurant Not Found." });

    case "menu":
      const restaurants = await Restaurant.find();

      const data = restaurants.filter(r => r.menu.id(target))[0];

      const menuItem = await data.menu.id(target);

      if (menuItem) {
        items.forEach(async item => {
          const image = await menuItem.images.id(item);

          if (image) {
            await deleteService(await image.remove());
          }
        });
        await data.save();
        return response.send({ message: "Images Deleted!" });
      }
      return response.status(404).send({ message: `Item Not Found.` });

    default:
      return response
        .status(404)
        .send({ message: `Resource: ${resource} Not Found.` });
  }
}

module.exports = {
  upload,
  destroy
};
