import { describe, expect, test, jest } from '@jest/globals';
import { authMW } from '../../src/middlewares';
import { ObjectRepository } from '../../src/service/types';
import { Request, Response } from 'express';

describe('authMW', () => {
  test('Nincs locals.me, átirányít', async () => {
    const req = {} as Request;
    const res = {
      locals: {},
      redirect: jest.fn((path: string) => {
        expect(path).toEqual('/');
      }),
    } as unknown as Response;
    const next = jest.fn();

    authMW({} as ObjectRepository)(req, res, next);
    expect(next).not.toBeCalled();
  });

  test('Van locals.me, next', async () => {
    const req = {} as Request;
    const res = {
      locals: { me: {} },
      redirect: jest.fn(),
    } as unknown as Response;
    const next = jest.fn((err) => {
      expect(err).toBeUndefined();
    });

    authMW({} as ObjectRepository)(req, res, next);
    expect(res.redirect).not.toBeCalled();
  });
});
