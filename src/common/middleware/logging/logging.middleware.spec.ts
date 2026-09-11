import { Request, Response, NextFunction } from 'express';
import { LoggingMiddleware } from './logging.middleware';

describe('LoggingMiddleware', () => {
  let middleware: LoggingMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    middleware = new LoggingMiddleware();
    mockRequest = {
      method: 'GET',
      originalUrl: '/api/v1/products',
    };
    mockResponse = {};
    nextFunction = jest.fn();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should log request method and originalUrl, then call next()', () => {
    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(consoleLogSpy).toHaveBeenCalledWith('Request: GET /api/v1/products');
    expect(nextFunction).toHaveBeenCalledTimes(1);
  });

  it('should format log output correctly for POST requests', () => {
    mockRequest.method = 'POST';
    mockRequest.originalUrl = '/api/v1/orders';

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(consoleLogSpy).toHaveBeenCalledWith('Request: POST /api/v1/orders');
    expect(nextFunction).toHaveBeenCalled();
  });
});
