import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockArgumentsHost: Partial<ArgumentsHost>;

  beforeEach(() => {
    filter = new HttpExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    };
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should handle HttpException with string response', () => {
    const exception = new HttpException(
      'Forbidden access',
      HttpStatus.FORBIDDEN,
    );

    filter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      statusCode: HttpStatus.FORBIDDEN,
      message: 'Forbidden access',
      data: null,
      timestamp: expect.any(String),
    });
  });

  it('should handle HttpException with object response', () => {
    const exception = new HttpException(
      { message: 'Item not found in stock' },
      HttpStatus.NOT_FOUND,
    );

    filter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Item not found in stock',
      data: null,
      timestamp: expect.any(String),
    });
  });

  it('should join array messages into a single string (ValidationPipe support)', () => {
    const exception = new HttpException(
      { message: ['price must be a positive number', 'quantity is required'] },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'price must be a positive number, quantity is required',
      data: null,
      timestamp: expect.any(String),
    });
  });

  it('should handle unexpected non-HttpException errors with 500 status', () => {
    const exception = new Error('Database connection failed');

    filter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      data: null,
      timestamp: expect.any(String),
    });
  });
});
