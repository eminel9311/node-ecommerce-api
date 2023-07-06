import mongoose from 'mongoose';
import { countConnect } from '../helpers/check.connect';
import config from '../configs/config';

const { host, port, name, user, password } = config.db;

const connectString = `mongodb://${user}:${password}@${host}:${port}/?authMechanism=SCRAM-SHA-1`;
class Database {
  static instance: Database;
  constructor() {
    this.connect();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  connect(_type = 'mongodb') {
    const mode = 1; //fake mode dev
    if (mode == 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
      mongoose.set('strictQuery', true);
    }
    const options = {
      autoIndex: true, // Don't build indexes
      maxPoolSize: 50, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      dbName: name,
    };
    mongoose
      .connect(connectString, options)
      .then((_) => console.log(`Connected MongoDB Success`, countConnect()))
      .catch((err) => console.log(`Error Connect`, err));
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
  }
}
const instanceMongodb = Database.getInstance();
export default instanceMongodb;

