import { KukoriDb } from "./db";

export class MistakeError extends Error {}

export type ObjectRepository = {
  db: KukoriDb
};
