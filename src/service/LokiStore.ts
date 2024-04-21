import { SessionData, Store } from 'express-session';
import Loki, { Collection } from 'lokijs';

export type LokiStoreOptions = {
  path?: string;
  autosave?: boolean;
  ttl?: number;
  logErrors?: boolean | ((err: any) => void);
};

type SessionItem = {
  sid: string;
  content: SessionData;
  updatedAt: Date;
};

export class LokiStore extends Store {
  private autosave: boolean;
  private storePath: string;
  private ttl: number | null;

  private client: Loki;
  private collection: Collection<SessionItem> | null;
  private logger: (err: any) => void;

  constructor(options?: LokiStoreOptions) {
    options = options ?? {};
    super();

    this.autosave = options.autosave !== false;
    this.storePath = options.path || './session-store.db';
    this.ttl = options.ttl || 1209600;
    if (this.ttl === 0) {
      this.ttl = null;
    }

    // Initialize Loki.js
    this.client = new Loki(this.storePath, {
      env: 'NODEJS',
      autosave: this.autosave,
      autosaveInterval: 5000,
    });

    // Setup error logging
    if (options.logErrors) {
      if (typeof options.logErrors !== 'function') {
        options.logErrors = function (err) {
          console.error('Warning: connect-loki reported a client error: ' + err);
        };
      }
      this.logger = options.logErrors;
    } else {
      this.logger = () => {};
    }

    // Get / Create collection
    this.collection = null;
    this.client.loadDatabase({}, () => {
      this.collection = this.client.getCollection<SessionItem>('Sessions');
      if (this.collection === null) {
        this.collection = this.client.addCollection<SessionItem>('Sessions', {
          indices: ['sid'],
          ttlInterval: this.ttl ?? undefined,
        });
      }
      this.collection.on('error', (err) => {
        return this.logger(err);
      });
      this.emit('connect');
    });
  }

  get(sid: string, callback: (err: any, session?: SessionData | null | undefined) => void): void {
    if (!this.collection) {
      return callback(new Error('Session storage not found.'));
    }
    const s = this.collection.findOne({ sid });
    if (s?.content) {
      callback(null, s.content);
    } else {
      callback(null);
    }
  }

  set(sid: string, session: SessionData, callback?: ((err?: any) => void) | undefined): void {
    if (!this.collection) {
      if (callback) {
        return callback(new Error('Session storage not found.'));
      }
      return;
    }
    const s = this.collection?.findOne({ sid });
    if (s?.content) {
      s.content = session;
      s.updatedAt = new Date();
      this.collection.update(s);
    } else {
      this.collection.insert({
        sid,
        content: session,
        updatedAt: new Date(),
      });
    }

    if (callback) {
      callback(null);
    }
  }

  destroy(sid: string, callback?: ((err?: any) => void) | undefined): void {
    this.collection?.findAndRemove({ sid });
    if (callback) {
      callback(null);
    }
  }
}
