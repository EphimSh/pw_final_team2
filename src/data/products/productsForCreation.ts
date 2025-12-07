import { MANUFACTURERS } from "data/types/manufacturers";
import { generateProductData } from "./generateProductData";
import { faker } from "@faker-js/faker";

export const productsForCreation = [
  generateProductData({
    name: "iPhone 15 Pro 512GB" + faker.number.int({ min: 1, max: 100000 }),
    manufacturer: MANUFACTURERS.APPLE,
    price: 3500,
  }),
  generateProductData({
    name: "Apple Watch Series X" + faker.number.int({ min: 1, max: 100000 }),
    manufacturer: MANUFACTURERS.APPLE,
    price: 900,
  }),
  generateProductData({
    name: "Samsung Galaxy S25" + faker.number.int({ min: 1, max: 100000 }),
    manufacturer: MANUFACTURERS.SAMSUNG,
    price: 3100,
  }),
  generateProductData({
    name: "Samsung Galaxy A55" + faker.number.int({ min: 1, max: 100000 }),
    manufacturer: MANUFACTURERS.SAMSUNG,
    price: 800,
  }),
  generateProductData({
    name: "Sony Xperia Pro" + faker.number.int({ min: 1, max: 100000 }),
    manufacturer: MANUFACTURERS.SONY,
    price: 2000,
  }),
  generateProductData({
    name: "Google Pixel Ultra" + faker.number.int({ min: 1, max: 100000 }),
    manufacturer: MANUFACTURERS.GOOGLE,
    price: 1800,
  }),
  generateProductData({
    name: "Microsoft Surface Duo 3" + faker.number.int({ min: 1, max: 100000 }),
    manufacturer: MANUFACTURERS.MICROSOFT,
    price: 2200,
  }),
  generateProductData({
    name: "Xiaomi Mi 14 Ultra" + faker.number.int({ min: 1, max: 100000 }),
    manufacturer: MANUFACTURERS.XIAOMI,
    price: 1200,
  }),
];
