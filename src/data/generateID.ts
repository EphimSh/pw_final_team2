import { ObjectId } from "bson";

export function generateID() {
  return new ObjectId().toHexString();
}
