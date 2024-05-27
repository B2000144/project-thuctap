const PriceModel = require("../models/pirce");
const ObjectId = require("mongoose").Types.ObjectId;
class PriceService {
  static addPrice = async (id_product, price_number) => {
    const ID_PRODUCT = new ObjectId(id_product);
    await PriceModel.create({
      ID_PRODUCT: ID_PRODUCT,
      LIST_PRICE: [
        {
          PRICE_NUMBER: price_number,
          FROM_DATE: new Date(),
          TO_DATE: null,
        },
      ],
    });
  };
  static deletePrice = async (id_product, id_list_price) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const ID_LIST_PRICE = new ObjectId(id_list_price);
    await PriceModel.updateOne(
      {
        ID_PRODUCT: ID_PRODUCT,
        LIST_PRICE: {
          $elemMatch: {
            TO_DATE: null,
            _id: ID_LIST_PRICE,
          },
        },
      },
      {
        $set: { "LIST_PRICE.$[element].TO_DATE": new Date() },
      },
      {
        arrayFilters: [
          {
            "element._id": ID_LIST_PRICE,
          },
        ],
      }
    );
  };
  static getPrice = async (id_product) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const getALLPrice = PriceModel.aggregate([
      {
        $match: {
          ID_PRODUCT: ID_PRODUCT,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "ID_PRODUCT",
          foreignField: "_id",
          as: "PRODUCT",
        },
      },
      {
        $unwind: {
          path: "$PRODUCT",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "LIST_PRICE.TO_DATE": null,
        },
      },
      {
        $group: {
          _id: "$ID_PRODUCT",
          PRODUCT: {
            $addToSet: "$PRODUCT",
          },
          LIST_PRICE: {
            $push: "$LIST_PRICE",
          },
        },
      },
    ]);
    return getALLPrice;
  };
  static updatePrice = async (id_product, id_list_price, price_number) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const ID_LIST_PRICE = new ObjectId(id_list_price);
    const update = await PriceModel.updateOne(
      {
        ID_PRODUCT: ID_PRODUCT,
        LIST_PRICE: {
          $elemMatch: {
            TO_DATE: null,
            _id: ID_LIST_PRICE,
          },
        },
      },
      {
        $set: { "LIST_PRICE.$[element].PRICE_NUMBER": price_number },
      },
      {
        arrayFilters: [
          {
            "element._id": ID_LIST_PRICE,
          },
        ],
      }
    );
    return update;
  };
}
module.exports = PriceService;