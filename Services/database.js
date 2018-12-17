"use  strict";

const { MongoClient } = require("mongodb");
const { ObjectID } = require("mongodb");
const { config } = require("dotenv");
config({ path: "./.env" });

class Database {
  constructor(conn) {
    this.conn = conn;
  }

  static async connection() {
    try {
      const connect = await MongoClient.connect(
        process.env.DATABASE,
        { useNewUrlParser: true }
      );
      return connect;
    } catch (error) {
      return error;
    }
  }

  async insertSearch(informations) {
    try {
      const conn = await this.conn;
      const db = conn.db("olx").collection("search");
      return db.insertOne({ informations });
    } catch (error) {
      return error;
    }
  }
}
module.exports = Database;
