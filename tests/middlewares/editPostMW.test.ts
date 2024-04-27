import { describe, expect, test, jest } from '@jest/globals';
import { editPostMW } from '../../src/middlewares';
import { ObjectRepository } from '../../src/service/types';
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
});
