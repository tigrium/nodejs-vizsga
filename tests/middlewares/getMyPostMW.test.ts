import { describe, expect, test, jest } from '@jest/globals';
import { getMyPostMW } from '../../src/middlewares';
import { MistakeError, ObjectRepository } from '../../src/service/types';
import { Request, Response } from 'express';

describe('getMyPostMW', () => {
  test('Helyes input, létező id', async () => {
    const objectRepo = {
      db: {
        models: {
          postModel: {
            findOne: jest.fn(() => ({
              id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
            })),
          },
        },
      },
    } as unknown as ObjectRepository;
    const req = {
      params: {
        postId: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
      },
    } as unknown as Request;
    const res = {
      locals: {
        me: {
          id: 'a8fbe6b0-ccaf-4088-95f0-5ad28dc200fa',
        },
      },
    } as unknown as Response;
    const next = jest.fn();

    await getMyPostMW(objectRepo)(req, res, next);
    expect(objectRepo.db.models.postModel.findOne).toBeCalledWith({
      id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
      userId: 'a8fbe6b0-ccaf-4088-95f0-5ad28dc200fa',
    });
    expect(res.locals.myPost).toEqual({ id: '85dc8f73-7c58-4e5d-a63a-c746321b9351' });
    expect(next).toBeCalledWith();
  });

  test('Helyes input, nem létező id', async () => {
    const objectRepo = {
      db: {
        models: {
          postModel: {
            findOne: jest.fn(),
          },
        },
      },
    } as unknown as ObjectRepository;
    const req = {
      params: {
        postId: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
      },
    } as unknown as Request;
    const res = {
      locals: {
        me: {
          id: 'a8fbe6b0-ccaf-4088-95f0-5ad28dc200fa',
        },
      },
    } as unknown as Response;
    const next = jest.fn((err: any) => {
      expect(err).toBeInstanceOf(MistakeError);
      expect(err.message).toEqual('Bejegyzés nem található.');
    });

    await getMyPostMW(objectRepo)(req, res, next);
    expect(objectRepo.db.models.postModel.findOne).toBeCalledWith({
      id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
      userId: 'a8fbe6b0-ccaf-4088-95f0-5ad28dc200fa',
    });
    expect(res.locals.myPost).toEqual(undefined);
    expect(next).toBeCalled();
  });

  test('Helytelen input', async () => {
    const objectRepo = {
      db: {
        models: {
          postModel: {
            findOne: jest.fn(),
          },
        },
      },
    } as unknown as ObjectRepository;
    const req = {
      params: {
        postId: 'abc',
      },
    } as unknown as Request;
    const res = {
      locals: {},
    } as unknown as Response;
    const next = jest.fn((err: any) => {
      expect(err).toBeInstanceOf(MistakeError);
      expect(err.messages).toEqual(['Érvénytelen azonosító.']);
    });

    await getMyPostMW(objectRepo)(req, res, next);
    expect(objectRepo.db.models.postModel.findOne).not.toBeCalled();
    expect(res.locals.myPost).toEqual(undefined);
    expect(next).toBeCalled();
  });
});
