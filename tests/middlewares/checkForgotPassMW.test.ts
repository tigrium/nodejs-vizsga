import { describe, expect, test, jest } from '@jest/globals';
import { checkForgotPassMW } from '../../src/middlewares';
import { MistakeError, ObjectRepository } from '../../src/service/types';
import { Request, Response } from 'express';
import { addMinutes } from 'date-fns';

describe('checkForgotPassMW', () => {
  test('Létező :secret, valid', async () => {
    const valid = addMinutes(new Date(), 10);
    const objectRepo = {
      db: {
        models: {
          forgotPassModel: {
            findOne: jest.fn(() => {
              return {
                valid,
              };
            }),
            remove: jest.fn(),
          },
        },
        database: {
          save: jest.fn((cb: (err?: any) => void) => {
            cb();
          }),
        },
      },
    } as unknown as ObjectRepository;
    const req = {
      params: {
        secret: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
      },
    } as unknown as Request;
    const res = {
      locals: {},
    } as unknown as Response;
    const next = jest.fn();

    await checkForgotPassMW(objectRepo)(req, res, next);
    expect(objectRepo.db.models.forgotPassModel.findOne).toBeCalledWith({
      secret: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
    });
    expect(objectRepo.db.models.forgotPassModel.remove).not.toBeCalled();
    expect(objectRepo.db.database.save).not.toBeCalled();
    expect(res.locals.ok).toBe(true);
    expect(res.locals.forgotPass).toEqual({ valid });
    expect(next).toBeCalledWith();
  });

  test('Létező :secret, lejárt', async () => {
    const valid = addMinutes(new Date(), -10);
    const objectRepo = {
      db: {
        models: {
          forgotPassModel: {
            findOne: jest.fn(() => {
              return {
                valid,
              };
            }),
            remove: jest.fn(),
          },
        },
        database: {
          save: jest.fn((cb: (err?: any) => void) => {
            cb();
          }),
        },
      },
    } as unknown as ObjectRepository;
    const req = {
      params: {
        secret: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
      },
    } as unknown as Request;
    const res = {
      locals: {},
    } as unknown as Response;
    const next = jest.fn();

    await checkForgotPassMW(objectRepo)(req, res, next);
    expect(objectRepo.db.models.forgotPassModel.findOne).toBeCalledWith({
      secret: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
    });
    expect(objectRepo.db.models.forgotPassModel.remove).toBeCalledWith({ valid });
    expect(objectRepo.db.database.save).toBeCalled();
    expect(res.locals.ok).toBe(false);
    expect(res.locals.forgotPass).toBeUndefined();
    expect(next).toBeCalledWith();
  });

  test('Nem létező :secret', async () => {
    const objectRepo = {
      db: {
        models: {
          forgotPassModel: {
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        database: {
          save: jest.fn((cb: (err?: any) => void) => {
            cb();
          }),
        },
      },
    } as unknown as ObjectRepository;
    const req = {
      params: {
        secret: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
      },
    } as unknown as Request;
    const res = {
      locals: {},
    } as unknown as Response;
    const next = jest.fn();

    await checkForgotPassMW(objectRepo)(req, res, next);
    expect(objectRepo.db.models.forgotPassModel.findOne).toBeCalledWith({
      secret: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
    });
    expect(objectRepo.db.models.forgotPassModel.remove).not.toBeCalled();
    expect(objectRepo.db.database.save).not.toBeCalled();
    expect(res.locals.ok).toBe(false);
    expect(res.locals.forgotPass).toBeUndefined();
    expect(next).toBeCalledWith();
  });

  test('Hibás :secret formátum', async () => {
    const objectRepo = {
      db: {
        models: {
          forgotPassModel: {
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        database: {
          save: jest.fn((cb: (err?: any) => void) => {
            cb();
          }),
        },
      },
    } as unknown as ObjectRepository;
    const req = {
      params: {
        secret: 'abc',
      },
    } as unknown as Request;
    const res = {
      locals: {},
    } as unknown as Response;
    const next = jest.fn((err) => {
      expect(err).toBeInstanceOf(MistakeError);
      expect((err as MistakeError).messages).toEqual(['Érvénytelen azonosító.']);
    });

    await checkForgotPassMW(objectRepo)(req, res, next);
  });

  test('Törlésnél hiba', async () => {
    const valid = addMinutes(new Date(), -10);
    const objectRepo = {
      db: {
        models: {
          forgotPassModel: {
            findOne: jest.fn(() => {
              return {
                valid,
              };
            }),
            remove: jest.fn(() => {
              throw new Error('error');
            }),
          },
        },
        database: {
          save: jest.fn((cb: (err?: any) => void) => {
            cb();
          }),
        },
      },
    } as unknown as ObjectRepository;
    const req = {
      params: {
        secret: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
      },
    } as unknown as Request;
    const res = {
      locals: {},
    } as unknown as Response;
    const next = jest.fn((err: any) => {
      expect(err.message).toEqual('error');
    });

    await checkForgotPassMW(objectRepo)(req, res, next);
    expect(objectRepo.db.models.forgotPassModel.findOne).toBeCalledWith({
      secret: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
    });
    expect(objectRepo.db.models.forgotPassModel.remove).toBeCalledWith({ valid });
    expect(objectRepo.db.database.save).not.toBeCalled();
    expect(res.locals.ok).toBe(false);
    expect(res.locals.forgotPass).toBeUndefined();
    expect(next).toBeCalled();
  });

  test('Mentésnél hiba', async () => {
    const valid = addMinutes(new Date(), -10);
    const objectRepo = {
      db: {
        models: {
          forgotPassModel: {
            findOne: jest.fn(() => {
              return {
                valid,
              };
            }),
            remove: jest.fn(),
          },
        },
        database: {
          save: jest.fn((cb: (err?: any) => void) => {
            cb(new Error('error'));
          }),
        },
      },
    } as unknown as ObjectRepository;
    const req = {
      params: {
        secret: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
      },
    } as unknown as Request;
    const res = {
      locals: {},
    } as unknown as Response;
    const next = jest.fn((err: any) => {
      expect(err.message).toEqual('error');
    });

    await checkForgotPassMW(objectRepo)(req, res, next);
    expect(objectRepo.db.models.forgotPassModel.findOne).toBeCalledWith({
      secret: '85dc8f73-7c58-4e5d-a63a-c746321b9351',
    });
    expect(objectRepo.db.models.forgotPassModel.remove).toBeCalledWith({ valid });
    expect(objectRepo.db.database.save).toBeCalled();
    expect(res.locals.ok).toBe(false);
    expect(res.locals.forgotPass).toBeUndefined();
    expect(next).toBeCalled();
  });
});
