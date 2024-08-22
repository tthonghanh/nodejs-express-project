import { faker } from "@faker-js/faker";
import models from "@models";

const seed = async () => {
  for (let i = 0; i < 100; i++) {
    await models.product.create({
      data: {
        id: faker.string.uuid(),
        // image: faker.image,
        productName: faker.commerce.product(),
        originalPrice: faker.commerce.price(),
        price: faker.commerce.price(),
        categoryId: "0f87d964-f941-45c8-8830-20b55d38b8d9",
        description: faker.commerce.productDescription(),
      },
    });
  }
};

seed();
