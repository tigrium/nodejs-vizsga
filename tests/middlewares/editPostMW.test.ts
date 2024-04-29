import { describe, expect, test, jest } from '@jest/globals';
import { editPostMW } from '../../src/middlewares';
import { MistakeError, ObjectRepository } from '../../src/service/types';
import { Request, Response } from 'express';

describe('editPostsW', () => {
  test('Helyes input, módosul a bejegyzés', async () => {
    const objectRepo = {
      db: {
        models: {
          postModel: {
            update: jest.fn(),
          },
        },
        database: {
          save: jest.fn(),
        },
      },
    } as unknown as ObjectRepository;
    const req = {
      body: {
        text: 'def',
      },
    } as Request;
    const res = {
      locals: {
        myPost: {
          id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
          text: 'abc',
        },
      },
      redirect: jest.fn((path: string) => {
        expect(path).toEqual('/');
      }),
    } as unknown as Response;
    const next = jest.fn();

    await editPostMW(objectRepo)(req, res, next);
    expect(objectRepo.db.models.postModel.update).toBeCalledWith({
      id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
      text: 'def',
    });
    expect(objectRepo.db.database.save).toBeCalled();
    expect(res.locals.myPost.text).toEqual('def');
    expect(next).toBeCalledWith();
  });

  test('Helytelen input', async () => {
    const objectRepo = {
      db: {
        models: {
          postModel: {
            update: jest.fn(),
          },
        },
        database: {
          save: jest.fn(),
        },
      },
    } as unknown as ObjectRepository;
    const req = {
      body: {
        post: 'def',
      },
    } as Request;
    const res = {
      locals: {
        myPost: {
          id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
          text: 'abc',
        },
      },
      redirect: jest.fn(),
    } as unknown as Response;
    const next = jest.fn((err) => {
      expect(err).toBeInstanceOf(MistakeError);
    });

    await editPostMW(objectRepo)(req, res, next);
    expect(next).toBeCalled();
    expect(objectRepo.db.models.postModel.update).not.toBeCalled();
    expect(objectRepo.db.database.save).not.toBeCalled();
    expect(res.locals.myPost.text).toEqual('abc');
  });

  test('Hiba a módosításnál', async () => {
    const objectRepo = {
      db: {
        models: {
          postModel: {
            update: jest.fn(() => {
              throw new Error('error');
            }),
          },
        },
        database: {
          save: jest.fn(),
        },
      },
    } as unknown as ObjectRepository;
    const req = {
      body: {
        text: 'def',
      },
    } as Request;
    const res = {
      locals: {
        myPost: {
          id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
          text: 'abc',
        },
      },
      redirect: jest.fn((path: string) => {
        expect(path).toEqual('/');
      }),
    } as unknown as Response;
    const next = jest.fn((err: any) => {
      expect(err.message).toEqual('error');
    });

    await editPostMW(objectRepo)(req, res, next);
    expect(objectRepo.db.models.postModel.update).toBeCalledWith({
      id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
      text: 'def',
    });
    expect(objectRepo.db.database.save).not.toBeCalled();
    expect(res.locals.myPost.text).toEqual('def');
    expect(next).toBeCalled();
  });

  test('Hiba a mentésnél', async () => {
    const objectRepo = {
      db: {
        models: {
          postModel: {
            update: jest.fn(),
          },
        },
        database: {
          save: jest.fn(() => {
            throw new Error('error');
          }),
        },
      },
    } as unknown as ObjectRepository;
    const req = {
      body: {
        text: 'def',
      },
    } as Request;
    const res = {
      locals: {
        myPost: {
          id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
          text: 'abc',
        },
      },
      redirect: jest.fn((path: string) => {
        expect(path).toEqual('/');
      }),
    } as unknown as Response;
    const next = jest.fn((err: any) => {
      expect(err.message).toEqual('error');
    });

    await editPostMW(objectRepo)(req, res, next);
    expect(objectRepo.db.models.postModel.update).toBeCalledWith({
      id: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
      text: 'def',
    });
    expect(objectRepo.db.database.save).toBeCalled();
    expect(res.locals.myPost.text).toEqual('def');
    expect(next).toBeCalled();
  });
});
