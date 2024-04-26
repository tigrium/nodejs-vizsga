import Loki, { Collection } from 'lokijs';
import { ForgotPass, OriginalPost, Post, RePost, User } from './models';
import { PostToRender, PostUser } from './types';
import { formatTs } from './formatDate';

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
          unique: ['id', 'email', 'name'],
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
        resolve({
          database,
          models: { postModel, userModel, forgotPassModel },
        });
      });
    });
  });
};

export class UserResolver {
  private userModel: Collection<User>;
  private userData: Map<string, PostUser>;

  constructor(userModel: Collection<User>) {
    this.userModel = userModel;
    this.userData = new Map<string, PostUser>();
  }

  getData(id: string) {
    if (this.userData.has(id)) {
      return this.userData.get(id) as PostUser;
    }
    const user = this.userModel.findOne({ id });
    if (!user) {
      throw new Error('Felhasználó nem található.');
    }
    const userData: PostUser = { name: user.name, picturePath: user.picturePath || null };
    this.userData.set(id, userData);
    return userData;
  }
}

export class PostResolver {
  private postModel: Collection<Post>;
  private nameResolver: UserResolver;

  constructor(postModel: Collection<Post>, userModel: Collection<User>) {
    this.postModel = postModel;
    this.nameResolver = new UserResolver(userModel);
  }

  private originalPost(post: Post, withoutUser?: boolean): PostToRender | null {
    if (!Object.keys(post).includes('text')) {
      return null;
    }
    const { id, userId, text, ts } = post as OriginalPost;
    const toRender: PostToRender = {
      id,
      text,
      ts: formatTs(ts),
    };
    if (!withoutUser) {
      const userData = this.nameResolver.getData(userId);
      toRender.user = userData;
    }
    return toRender;
  }

  private userAndTs(post: Post): PostToRender['original'] {
    return {
      user: this.nameResolver.getData(post.userId),
      ts: formatTs(post.ts),
    };
  }

  private rePost(post: Post, withoutUser?: boolean): PostToRender | null {
    if (!Object.keys(post).includes('postId')) {
      return null;
    }

    const originalPost = this.postModel.findOne({ id: (post as RePost).postId }) as OriginalPost | undefined;
    // if (!originalPost) {
    //   throw new Error('Post nem található.');
    // }

    const { id, userId, ts } = post;
    const original = originalPost ? this.userAndTs(originalPost) : null;
    const toRender: PostToRender = {
      id,
      text: originalPost?.text ?? '>>> Visszavont gondolat újrakukorékolása. <<<',
      ts: formatTs(ts),
      original,
    };
    if (!withoutUser) {
      toRender.user = this.nameResolver.getData(userId);
    }
    return toRender;
  }

  getPosts(posts: Post[], withoutUser?: boolean): PostToRender[] {
    return posts.map(
      (post) => this.originalPost(post, withoutUser) ?? (this.rePost(post, withoutUser) as PostToRender),
    );
  }

  getName(userId: string) {
    return this.nameResolver.getData(userId);
  }
}
