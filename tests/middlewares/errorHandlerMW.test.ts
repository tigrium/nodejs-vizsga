import { describe, expect, test, jest } from '@jest/globals';
import { errorHandlerMW } from '../../src/middlewares';
import { ObjectRepository } from '../../src/service/types';
import { Request, Response } from 'express';

describe('errorHandlerMW', () => {
  test('Hibát kap, errort renderel', async () => {
    const err = new Error();
    const req = {} as Request;
    const res = {
      render: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    await errorHandlerMW({} as ObjectRepository)(err, req, res, next);
    expect(res.render).toBeCalledWith('error');
    expect(next).not.toBeCalled();
  });
});
