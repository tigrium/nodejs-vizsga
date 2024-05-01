import { describe, expect, test, jest, afterAll } from '@jest/globals';
import { getMyPostsMW } from '../../src/middlewares';
import { ObjectRepository } from '../../src/service/types';
import { Request, Response } from 'express';
import { PostResolver } from '../../src/service/db';

describe('getMyPostsMW', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Megtalálja és elmenti a bejegyzéseket', async () => {
    const objectRepo = {
      db: {
        models: {
          postModel: {
            find: jest.fn(() => [
              {
                id: '03c79fe6-cdd5-4120-a72c-2234214bf400',
                ts: new Date('2024-04-29 08:00:00').getTime(),
                text: 'a',
              },
              {
                id: 'e9e0d3ed-2921-464b-b035-fdc3c22444b8',
                ts: new Date('2024-04-29 11:00:00').getTime(),
                text: 'b',
              },
              {
                id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
                ts: new Date('2024-04-29 10:00:00').getTime(),
                text: 'c',
              },
            ]),
          },
        },
      },
    } as unknown as ObjectRepository;
    const req = {} as Request;
    const res = {
      locals: {
        me: {
          id: 'a8fbe6b0-ccaf-4088-95f0-5ad28dc200fa',
        },
      },
    } as unknown as Response;
    const next = jest.fn();

    await getMyPostsMW(objectRepo)(req, res, next);
    expect(objectRepo.db.models.postModel.find).toBeCalledWith({
      userId: 'a8fbe6b0-ccaf-4088-95f0-5ad28dc200fa',
    });
    expect(res.locals.posts).toEqual([
      {
        id: 'e9e0d3ed-2921-464b-b035-fdc3c22444b8',
        ts: '2024.04.29. 11:00:00',
        text: 'b',
      },
      {
        id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
        ts: '2024.04.29. 10:00:00',
        text: 'c',
      },
      {
        id: '03c79fe6-cdd5-4120-a72c-2234214bf400',
        ts: '2024.04.29. 8:00:00',
        text: 'a',
      },
    ]);
    expect(res.locals.myPosts).toEqual(true);
    expect(next).toBeCalledWith();
  });

  test('Hiba a feldolgozás során', async () => {
    const objectRepo = {
      db: {
        models: {
          postModel: {
            find: jest.fn(() => [
              {
                id: '03c79fe6-cdd5-4120-a72c-2234214bf400',
                ts: new Date('2024-04-29 08:00:00').getTime(),
                text: 'a',
              },
              {
                id: 'e9e0d3ed-2921-464b-b035-fdc3c22444b8',
                ts: new Date('2024-04-29 11:00:00').getTime(),
                text: 'b',
              },
              {
                id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
                ts: new Date('2024-04-29 10:00:00').getTime(),
                text: 'c',
              },
            ]),
          },
        },
      },
    } as unknown as ObjectRepository;
    const req = {} as Request;
    const res = {
      locals: {
        me: {
          id: 'a8fbe6b0-ccaf-4088-95f0-5ad28dc200fa',
        },
      },
    } as unknown as Response;
    const next = jest.fn((err: any) => {
      expect(err.message).toEqual('error');
    });
    jest.spyOn(PostResolver.prototype, 'getPosts').mockImplementation(() => {
      throw new Error('error');
    });

    await getMyPostsMW(objectRepo)(req, res, next);
    expect(objectRepo.db.models.postModel.find).toBeCalledWith({
      userId: 'a8fbe6b0-ccaf-4088-95f0-5ad28dc200fa',
    });
    expect(res.locals.posts).toEqual(undefined);
    expect(res.locals.myPosts).toEqual(undefined);
    expect(next).toBeCalled();
  });
});
