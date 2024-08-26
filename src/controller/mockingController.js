import { fakerEN_US as faker } from "@faker-js/faker";
export class MockingController {
  static generateProducts = (req, res, next) => {
    try {
      let products = [];
      for (let i = 0; i < 100; i++) {
        products.push({
          _id: faker.database.mongodbObjectId(),
          title: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          code: faker.string.alphanumeric(4),
          price: faker.commerce.price({ min: 10, max: 500 }),
          status: true,
          stock: faker.number.int({ min: 1, max: 100 }),
          category: faker.commerce.productAdjective(),
          thumbnails: [faker.image.url()],
        });
      }
      res.json(products);
    } catch (error) {
      if (error.code !== 500) {
        req.logger.error(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      } else {
        req.logger.fatal(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      }
      next(error);
    }
  };
}
