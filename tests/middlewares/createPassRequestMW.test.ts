import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { createPassRequestMW } from '../../src/middlewares';
import { MistakeError, ObjectRepository } from '../../src/service/types';
import { Request, Response } from 'express';
import * as sendEmailModule from '../../src/service/sendEmail';

describe('createPassRequestMW', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Helyes input, létrejön a jelszómódosító bejegyzés', async () => {
    const objectRepo = {
      db: {
        models: {
          userModel: {
            findOne: jest.fn(() => ({
              id: 'a8fbe6b0-ccaf-4088-95f0-5ad28dc200fa',
              email: 'email@example.com',
              name: 'Name',
            })),
          },
          forgotPassModel: {
            insert: jest.fn(({ userId, secret, valid }) => {
              expect(userId).toEqual('a8fbe6b0-ccaf-4088-95f0-5ad28dc200fa');
              expect(secret).toEqual('85dc8f73-7c58-4e5d-a63a-c746321b9351');
              expect(typeof valid).toEqual('number');
            }),
          },
        },
        database: {
          save: jest.fn((cb: () => void) => cb()),
        },
      },
      uuid: jest.fn(() => {
        return '85dc8f73-7c58-4e5d-a63a-c746321b9351';
      }),
    } as unknown as ObjectRepository;
    const req = {
      body: {
        email: 'email@example.com',
      },
      protocol: 'http',
      headers: {
        host: 'localhost:4000',
      },
    } as Request;
    const res = {} as Response;
    const next = jest.fn();
    const sendEmail = jest.spyOn(sendEmailModule, 'sendEmail').mockImplementation(() => Promise.resolve());

    await createPassRequestMW(objectRepo)(req, res, next);
    expect(objectRepo.db.models.userModel.findOne).toBeCalledWith({ email: 'email@example.com' });
    expect(objectRepo.db.models.forgotPassModel.insert).toBeCalled();
    expect(objectRepo.db.database.save).toBeCalled();
    expect(sendEmail).toBeCalledWith({
      recipient: 'email@example.com',
      subject: 'Elfelejtett jelszó kérés',
      message: `Kedves Name!

Ezen a címen állíthatsz be új jelszót: http://localhost:4000/forgotpass/85dc8f73-7c58-4e5d-a63a-c746321b9351
A link 1 órán keresztül érvényes.

Üdvözlettel,
Kukori`,
    });
    expect(next).toBeCalledWith();
  });

  test('Helyes input, nem létező email', async () => {
    const objectRepo = {
      db: {
        models: {
          userModel: {
            findOne: jest.fn(),
          },
          forgotPassModel: {
            insert: jest.fn(),
          },
        },
        database: {
          save: jest.fn((cb: (err?: any) => void) => {
            cb();
          }),
        },
      },
      uuid: jest.fn(() => {
        return '85dc8f73-7c58-4e5d-a63a-c746321b9351';
      }),
    } as unknown as ObjectRepository;
    const req = {
      body: {
        email: 'email@example.com',
      },
    } as Request;
    const res = {} as Response;
    const next = jest.fn();
    const sendEmail = jest.spyOn(sendEmailModule, 'sendEmail').mockImplementation(() => Promise.resolve());

    await createPassRequestMW(objectRepo)(req, res, next);
    expect(objectRepo.db.models.userModel.findOne).toBeCalledWith({ email: 'email@example.com' });
    expect(objectRepo.db.models.forgotPassModel.insert).not.toBeCalled();
    expect(objectRepo.db.database.save).not.toBeCalled();
    expect(sendEmail).not.toBeCalled();
    expect(next).toBeCalledWith();
  });

  test('Helytelen input', async () => {
    const objectRepo = {
      db: {
        models: {
          userModel: {
            findOne: jest.fn(),
          },
          forgotPassModel: {
            insert: jest.fn(),
          },
        },
        database: {
          save: jest.fn((cb: (err?: any) => void) => {
            cb();
          }),
        },
      },
      uuid: jest.fn(() => {
        return '85dc8f73-7c58-4e5d-a63a-c746321b9351';
      }),
    } as unknown as ObjectRepository;
    const req = {
      body: {
        email: 'emailaddress',
      },
    } as Request;
    const res = {} as Response;
    const next = jest.fn((err: any) => {
      expect(err).toBeInstanceOf(MistakeError);
      expect(err.messages).toEqual(['Az e-mail cím nem megfelelő formátumú.']);
    });
    const sendEmail = jest.spyOn(sendEmailModule, 'sendEmail').mockImplementation(() => Promise.resolve());

    await createPassRequestMW(objectRepo)(req, res, next);
    expect(objectRepo.db.models.userModel.findOne).not.toBeCalled();
    expect(objectRepo.db.models.forgotPassModel.insert).not.toBeCalled();
    expect(objectRepo.db.database.save).not.toBeCalled();
    expect(sendEmail).not.toBeCalled();
    expect(next).toBeCalled();
  });

  test('Insertnél hiba', async () => {
    const objectRepo = {
      db: {
        models: {
          userModel: {
            findOne: jest.fn(() => ({
              id: 'a8fbe6b0-ccaf-4088-95f0-5ad28dc200fa',
              email: 'email@example.com',
              name: 'Name',
            })),
          },
          forgotPassModel: {
            insert: jest.fn(() => {
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
      uuid: jest.fn(() => {
        return '85dc8f73-7c58-4e5d-a63a-c746321b9351';
      }),
    } as unknown as ObjectRepository;
    const req = {
      body: {
        email: 'email@example.com',
      },
    } as Request;
    const res = {} as Response;
    const next = jest.fn((err: any) => {
      expect(err.message).toEqual('error');
    });
    const sendEmail = jest.spyOn(sendEmailModule, 'sendEmail').mockImplementation(() => Promise.resolve());

    await createPassRequestMW(objectRepo)(req, res, next);
    expect(objectRepo.db.models.userModel.findOne).toBeCalledWith({ email: 'email@example.com' });
    expect(objectRepo.db.models.forgotPassModel.insert).toBeCalled();
    expect(objectRepo.db.database.save).not.toBeCalled();
    expect(sendEmail).not.toBeCalled();
    expect(next).toBeCalled();
  });

  test('Mentésnél hiba', async () => {
    const objectRepo = {
      db: {
        models: {
          userModel: {
            findOne: jest.fn(() => ({
              id: 'a8fbe6b0-ccaf-4088-95f0-5ad28dc200fa',
              email: 'email@example.com',
              name: 'Name',
            })),
          },
          forgotPassModel: {
            insert: jest.fn(),
          },
        },
        database: {
          save: jest.fn((cb: (err?: any) => void) => {
            cb(new Error('error'));
          }),
        },
      },
      uuid: jest.fn(() => {
        return '85dc8f73-7c58-4e5d-a63a-c746321b9351';
      }),
    } as unknown as ObjectRepository;
    const req = {
      body: {
        email: 'email@example.com',
      },
      protocol: 'http',
      headers: {
        host: 'localhost:4000',
      },
    } as Request;
    const res = {} as Response;
    const next = jest.fn((err: any) => {
      expect(err.message).toEqual('error');
    });
    const sendEmail = jest.spyOn(sendEmailModule, 'sendEmail').mockImplementation(() => Promise.resolve());

    await createPassRequestMW(objectRepo)(req, res, next);
    expect(objectRepo.db.models.userModel.findOne).toBeCalledWith({ email: 'email@example.com' });
    expect(objectRepo.db.models.forgotPassModel.insert).toBeCalled();
    expect(objectRepo.db.database.save).toBeCalled();
    expect(sendEmail).not.toBeCalled();
    expect(next).toBeCalled();
  });

  test('Emailnél hiba', async () => {
    const objectRepo = {
      db: {
        models: {
          userModel: {
            findOne: jest.fn(() => ({
              id: 'a8fbe6b0-ccaf-4088-95f0-5ad28dc200fa',
              email: 'email@example.com',
              name: 'Name',
            })),
          },
          forgotPassModel: {
            insert: jest.fn(({ userId, secret, valid }) => {
              expect(userId).toEqual('a8fbe6b0-ccaf-4088-95f0-5ad28dc200fa');
              expect(secret).toEqual('85dc8f73-7c58-4e5d-a63a-c746321b9351');
              expect(typeof valid).toEqual('number');
            }),
          },
        },
        database: {
          save: jest.fn((cb: (err?: any) => void) => {
            cb();
          }),
        },
      },
      uuid: jest.fn(() => {
        return '85dc8f73-7c58-4e5d-a63a-c746321b9351';
      }),
    } as unknown as ObjectRepository;
    const req = {
      body: {
        email: 'email@example.com',
      },
      protocol: 'http',
      headers: {
        host: 'localhost:4000',
      },
    } as Request;
    const res = {} as Response;
    const next = jest.fn((err: any) => {
      expect(err.message).toEqual('error');
    });
    const sendEmail = jest
      .spyOn(sendEmailModule, 'sendEmail')
      .mockImplementation(() => Promise.reject(new Error('error')));

    await createPassRequestMW(objectRepo)(req, res, next);
    expect(objectRepo.db.models.userModel.findOne).toBeCalledWith({ email: 'email@example.com' });
    expect(objectRepo.db.models.forgotPassModel.insert).toBeCalled();
    expect(objectRepo.db.database.save).toBeCalled();
    expect(sendEmail).toBeCalled();
    expect(next).toBeCalled();
  });
});
