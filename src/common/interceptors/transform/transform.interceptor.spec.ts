import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, lastValueFrom } from 'rxjs';
import { TransformInterceptor } from './transform.interceptor';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<unknown>;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockCallHandler: Partial<CallHandler>;

  beforeEach(() => {
    interceptor = new TransformInterceptor();

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue({ statusCode: 200 }),
      }),
    };

    mockCallHandler = {
      handle: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should transform response payload into unified success format', async () => {
    const mockData = { id: 'prod_123', name: 'Coffee', price: 3.5 };
    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(mockData));

    const observable = interceptor.intercept(
      mockExecutionContext as ExecutionContext,
      mockCallHandler as CallHandler,
    );

    const result = await lastValueFrom(observable);

    expect(result).toEqual({
      success: true,
      statusCode: 200,
      message: 'Request successful',
      data: mockData,
      timestamp: expect.any(String),
    });
  });

  it('should dynamically inherit status code from HTTP response object', async () => {
    (mockExecutionContext.switchToHttp as jest.Mock).mockReturnValue({
      getResponse: jest.fn().mockReturnValue({ statusCode: 201 }),
    });

    const mockData = { id: 'order_999', status: 'created' };
    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(mockData));

    const observable = interceptor.intercept(
      mockExecutionContext as ExecutionContext,
      mockCallHandler as CallHandler,
    );

    const result = await lastValueFrom(observable);

    expect(result.statusCode).toBe(201);
  });

  it('should convert undefined or null returned values to null in data field', async () => {
    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(undefined));

    const observable = interceptor.intercept(
      mockExecutionContext as ExecutionContext,
      mockCallHandler as CallHandler,
    );

    const result = await lastValueFrom(observable);

    expect(result.data).toBeNull();
  });
});
