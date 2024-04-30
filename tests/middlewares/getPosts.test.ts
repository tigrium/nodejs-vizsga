import { describe, expect, test, jest } from '@jest/globals';
import { getPostsByUserMW, getPostsMW } from '../../src/middlewares';
import { MistakeError, ObjectRepository } from '../../src/service/types';
import { Request, Response } from 'express';

describe('getPostsMW', () => {
  test('Repost nélkül', async () => {
    const objectRepo = {
      db: {
        models: {
          postModel: {
            find: jest.fn(() => [
              {
                id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
                text: 'a',
                userId: '1e2b6b4f-1ad6-4d7a-8d1f-b489b05f7ce0',
                ts: '2024-04-30 18:00:00',
              },
              {
                id: 'e2b2a6a6-e361-4674-8fc1-0eaea9e12339',
                text: 'b',
                userId: '1e2b6b4f-1ad6-4d7a-8d1f-b489b05f7ce0',
                ts: '2024-04-30 18:15:00',
              },
            ]),
            findOne: jest.fn(({ id }) => {
              if (id === '85dc8f73-7c58-4e5d-a63a-c746321b9351') {
                return {
                  id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
                  text: 'a',
                  userId: '1e2b6b4f-1ad6-4d7a-8d1f-b489b05f7ce0',
                  ts: '2024-04-30 18:00:00',
                };
              }
              return {
                id: 'e2b2a6a6-e361-4674-8fc1-0eaea9e12339',
                text: 'b',
                userId: '1e2b6b4f-1ad6-4d7a-8d1f-b489b05f7ce0',
                ts: '2024-04-30 18:15:00',
              };
            }),
          },
          userModel: {
            findOne: jest.fn(() => ({
              id: '1e2b6b4f-1ad6-4d7a-8d1f-b489b05f7ce0',
              name: 'Name',
            })),
          },
        },
      },
    } as unknown as ObjectRepository;
    const req = {} as Request;
    const res = {
      locals: {},
    } as Response;
    const next = jest.fn();

    await getPostsMW(objectRepo)(req, res, next);
    expect(res.locals.posts).toEqual([
      {
        id: 'e2b2a6a6-e361-4674-8fc1-0eaea9e12339',
        text: 'b',
        ts: '2024.04.30. 18:15:00',
        user: {
          name: 'Name',
          picturePath: null,
        },
      },
      {
        id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
        text: 'a',
        ts: '2024.04.30. 18:00:00',
        user: {
          name: 'Name',
          picturePath: null,
        },
      },
    ]);
    expect(next).toBeCalledWith();
  });

  test('Reposttal', async () => {
    const objectRepo = {
      db: {
        models: {
          postModel: {
            find: jest.fn(() => [
              {
                id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
                text: 'a',
                userId: '1e2b6b4f-1ad6-4d7a-8d1f-b489b05f7ce0',
                ts: '2024-04-30 18:00:00',
              },
              {
                id: 'e2b2a6a6-e361-4674-8fc1-0eaea9e12339',
                postId: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
                userId: 'd6b7902c-d233-4b6f-9d00-2d63b362061d',
                ts: '2024-04-30 18:15:00',
              },
            ]),
            findOne: jest.fn(({ id }) => {
              if (id === '85dc8f73-7c58-4e5d-a63a-c746321b9351') {
                return {
                  id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
                  text: 'a',
                  userId: '1e2b6b4f-1ad6-4d7a-8d1f-b489b05f7ce0',
                  ts: '2024-04-30 18:00:00',
                };
              }
              return {
                id: 'e2b2a6a6-e361-4674-8fc1-0eaea9e12339',
                postId: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
                userId: 'd6b7902c-d233-4b6f-9d00-2d63b362061d',
                ts: '2024-04-30 18:15:00',
              };
            }),
          },
          userModel: {
            findOne: jest.fn(({ id }) => {
              if (id === '1e2b6b4f-1ad6-4d7a-8d1f-b489b05f7ce0') {
                return {
                  id: '1e2b6b4f-1ad6-4d7a-8d1f-b489b05f7ce0',
                  name: 'Name',
                };
              }
              return {
                id: 'd6b7902c-d233-4b6f-9d00-2d63b362061d',
                name: 'Name 2',
              };
            }),
          },
        },
      },
    } as unknown as ObjectRepository;
    const req = {} as Request;
    const res = {
      locals: {},
    } as Response;
    const next = jest.fn();

    await getPostsMW(objectRepo)(req, res, next);
    expect(res.locals.posts).toEqual([
      {
        id: 'e2b2a6a6-e361-4674-8fc1-0eaea9e12339',
        text: 'a',
        ts: '2024.04.30. 18:15:00',
        user: {
          name: 'Name 2',
          picturePath: null,
        },
        original: {
          user: {
            name: 'Name',
            picturePath: null,
          },
          ts: '2024.04.30. 18:00:00',
        },
      },
      {
        id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
        text: 'a',
        ts: '2024.04.30. 18:00:00',
        user: {
          name: 'Name',
          picturePath: null,
        },
      },
    ]);
    expect(next).toBeCalledWith();
  });

  test('Váratlan hiba a feldolgozás közben', async () => {
    const objectRepo = {
      db: {
        models: {
          postModel: {
            find: jest.fn(() => {
              throw new Error('error');
            }),
          },
          userModel: {},
        },
      },
    } as unknown as ObjectRepository;
    const req = {} as Request;
    const res = {
      locals: {},
    } as Response;
    const next = jest.fn((err: any) => {
      expect(err.message).toEqual('error');
    });

    await getPostsMW(objectRepo)(req, res, next);
    expect(res.locals.posts).toEqual(undefined);
    expect(next).toBeCalled();
  });
});

describe('getPostsByUserMW', () => {
  test('Repost nélkül', async () => {
    const objectRepo = {
      db: {
        models: {
          postModel: {
            find: jest.fn(() => [
              {
                id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
                text: 'a',
                userId: '1e2b6b4f-1ad6-4d7a-8d1f-b489b05f7ce0',
                ts: '2024-04-30 18:00:00',
              },
              {
                id: 'e2b2a6a6-e361-4674-8fc1-0eaea9e12339',
                text: 'b',
                userId: '1e2b6b4f-1ad6-4d7a-8d1f-b489b05f7ce0',
                ts: '2024-04-30 18:15:00',
              },
            ]),
            findOne: jest.fn(({ id }) => {
              if (id === '85dc8f73-7c58-4e5d-a63a-c746321b9351') {
                return {
                  id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
                  text: 'a',
                  userId: '1e2b6b4f-1ad6-4d7a-8d1f-b489b05f7ce0',
                  ts: '2024-04-30 18:00:00',
                };
              }
              return {
                id: 'e2b2a6a6-e361-4674-8fc1-0eaea9e12339',
                text: 'b',
                userId: '1e2b6b4f-1ad6-4d7a-8d1f-b489b05f7ce0',
                ts: '2024-04-30 18:15:00',
              };
            }),
          },
          userModel: {
            findOne: jest.fn(() => ({
              id: '1e2b6b4f-1ad6-4d7a-8d1f-b489b05f7ce0',
              name: 'Name',
            })),
          },
        },
      },
    } as unknown as ObjectRepository;
    const req = {
      params: {
        userId: '1e2b6b4f-1ad6-4d7a-8d1f-b489b05f7ce0',
      },
    } as unknown as Request;
    const res = {
      locals: {},
    } as Response;
    const next = jest.fn();

    await getPostsByUserMW(objectRepo)(req, res, next);
    expect(res.locals.posts).toEqual([
      {
        id: 'e2b2a6a6-e361-4674-8fc1-0eaea9e12339',
        text: 'b',
        ts: '2024.04.30. 18:15:00',
      },
      {
        id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
        text: 'a',
        ts: '2024.04.30. 18:00:00',
      },
    ]);
    expect(res.locals.user).toEqual({ name: 'Name', picturePath: null });
    expect(next).toBeCalledWith();
  });

  test('Reposttal', async () => {
    const user1 = {
      id: '1e2b6b4f-1ad6-4d7a-8d1f-b489b05f7ce0',
      name: 'Name',
    };
    const user2 = {
      id: 'd6b7902c-d233-4b6f-9d00-2d63b362061d',
      name: 'Name 2',
    };
    const post1 = {
      id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
      text: 'a',
      userId: user1.id,
      ts: '2024-04-30 18:00:00',
    };
    const post2 = {
      id: '23a965b1-a954-4ddb-8cb8-b2a8f950621d',
      text: 'b',
      userId: user2.id,
      ts: '2024-04-30 18:10:00',
    };
    const repost = {
      id: 'e2b2a6a6-e361-4674-8fc1-0eaea9e12339',
      postId: post2.id,
      userId: user1.id,
      ts: '2024-04-30 18:15:00',
    };
    const objectRepo = {
      db: {
        models: {
          postModel: {
            find: jest.fn(() => [post1, repost]),
            findOne: jest.fn(({ id }) => {
              switch (id) {
                case post1.id:
                  return post1;
                case post2.id:
                  return post2;
                case repost:
                  return repost;
              }
            }),
          },
          userModel: {
            findOne: jest.fn(({ id }) => {
              switch (id) {
                case user1.id:
                  return user1;
                case user2.id:
                  return user2;
              }
            }),
          },
        },
      },
    } as unknown as ObjectRepository;
    const req = {
      params: {
        userId: user1.id,
      },
    } as unknown as Request;
    const res = {
      locals: {},
    } as Response;
    const next = jest.fn();

    await getPostsByUserMW(objectRepo)(req, res, next);
    expect(res.locals.posts).toEqual([
      {
        id: 'e2b2a6a6-e361-4674-8fc1-0eaea9e12339',
        text: 'b',
        ts: '2024.04.30. 18:15:00',
        original: {
          user: {
            name: 'Name 2',
            picturePath: null,
          },
          ts: '2024.04.30. 18:10:00',
        },
      },
      {
        id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
        text: 'a',
        ts: '2024.04.30. 18:00:00',
      },
    ]);
    expect(res.locals.user).toEqual({ name: 'Name', picturePath: null });
    expect(next).toBeCalledWith();
  });

  test('Hibás :userId', async () => {
    const objectRepo = {
      db: {
        models: {
          postModel: {},
          userModel: {
            findOne: jest.fn(),
          },
        },
      },
    } as unknown as ObjectRepository;
    const req = {
      params: {
        userId: 'abc',
      },
    } as unknown as Request;
    const res = {
      locals: {},
    } as Response;
    const next = jest.fn((err) => {
      expect(err).toBeInstanceOf(MistakeError);
      expect((err as MistakeError).messages).toEqual(['Érvénytelen azonosító.']);
    });

    await getPostsByUserMW(objectRepo)(req, res, next);
    expect(res.locals.posts).toEqual(undefined);
    expect(next).toBeCalled();
  });

  test('Váratlan hiba a feldolgozás közben', async () => {
    const objectRepo = {
      db: {
        models: {
          postModel: {
            find: jest.fn(),
          },
          userModel: {
            findOne: jest.fn(() => {
              throw new Error('error');
            }),
          },
        },
      },
    } as unknown as ObjectRepository;
    const req = {
      params: {
        userId: '1e2b6b4f-1ad6-4d7a-8d1f-b489b05f7ce0',
      },
    } as unknown as Request;
    const res = {
      locals: {},
    } as Response;
    const next = jest.fn((err: any) => {
      expect(err.message).toEqual('error');
    });

    await getPostsByUserMW(objectRepo)(req, res, next);
    expect(res.locals.posts).toEqual(undefined);
    expect(next).toBeCalled();
  });
});
