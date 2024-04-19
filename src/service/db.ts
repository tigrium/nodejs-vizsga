import Loki, { Collection } from 'lokijs';
import { ForgotPass, Post, User } from './models';

export type KukoriDb = {
  database: Loki;
  models: {
    postModel: Collection<Post>;
    userModel: Collection<User>;
    forgotPassModel: Collection<ForgotPass>;
  };
};

export const initDatabase = (): Promise<KukoriDb> => {
  return new Promise((resolve, reject) => {
    const database = new Loki('kukori.db');
    database.loadDatabase({}, (err) => {
      if (err) {
        reject(err);
      }
      let postModel = database.getCollection<Post>('posts');
      if (postModel === null) {
        postModel = database.addCollection<Post>('posts', {
          indices: ['id', 'ts'],
          unique: ['id'],
        });
      }
      let userModel = database.getCollection<User>('users');
      if (userModel === null) {
        userModel = database.addCollection<User>('users', {
          indices: ['id'],
          unique: ['id', 'email'],
        });
      }
      let forgotPassModel = database.getCollection<ForgotPass>('forgotpass');
      if (forgotPassModel === null) {
        forgotPassModel = database.addCollection<ForgotPass>('forgotpass', {
          indices: ['secret'],
          unique: ['secret'],
        });
      }
      database.saveDatabase((err) => {
        if (err) {
          reject(err);
        }
        console.log('Database saved after init.');
        console.table(userModel.find());
        console.table(postModel.find());
        console.table(forgotPassModel.find());
        resolve({
          database,
          models: { postModel, userModel, forgotPassModel },
        });
      });
    });
  });
};

module.exports.initDatabase = initDatabase;
