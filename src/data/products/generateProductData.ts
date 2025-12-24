import { faker } from "@faker-js/faker";
import { IProduct, IProductFromResponse } from "data/types/products.types";
import { getRandomEnumValue } from "utils/enum.utils";
import { MANUFACTURERS } from "data/types/manufacturers";
import { ObjectId } from "bson";
import { IOrderProduct } from "data/types/orders.types";

export function generateProductData(params?: Partial<IProduct>): IProduct {
  return {
    name: faker.commerce.product() + faker.number.int({ min: 1, max: 100000 }),
    manufacturer: getRandomEnumValue(MANUFACTURERS),
    price: faker.number.int({ min: 1, max: 99999 }),
    amount: faker.number.int({ min: 0, max: 999 }),
    notes: faker.string.alphanumeric({ length: 250 }),
    ...params,
  };
}

export function generateProductResponseData(params?: Partial<IProduct>): IProductFromResponse {
  const initial = generateProductData(params);
  return {
    _id: new ObjectId().toHexString(),
    name: initial.name,
    amount: initial.amount!,
    price: initial.price!,
    manufacturer: initial.manufacturer,
    createdOn: new Date().toISOString(),
    notes: initial.notes!,
  };
}

export function generateProductsDataForOrder(params?: Partial<IProduct>): IOrderProduct[] | undefined {
  const length = faker.number.int({ min: 1, max: 5 });
  const productsData: IOrderProduct[] = [];

  for (let i = 0; i < length; i++) {
    const productData: IOrderProduct = {
      _id: new ObjectId().toHexString(),
      name: faker.commerce.product() + faker.number.int({ min: 1, max: 100000 }),
      manufacturer: getRandomEnumValue(MANUFACTURERS),
      price: faker.number.int({ min: 1, max: 99999 }),
      amount: faker.number.int({ min: 0, max: 999 }),
      notes: faker.string.alphanumeric({ length: 250 }),
      received: faker.datatype.boolean(),
      ...params,
    };
    productsData.push(productData);
  }
  return productsData;
}

export function listOfProductsId(params: IProductFromResponse[]): string[] {
  return params.map((product) => product._id);
}
