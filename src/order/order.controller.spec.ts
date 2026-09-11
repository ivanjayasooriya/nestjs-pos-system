import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrder = {
    id: 1,
    customerId: 1,
    totalAmount: 100.5,
    status: 'COMPLETED',
  };

  const mockOrderService = {
    create: jest.fn().mockResolvedValue(mockOrder),
    findAll: jest.fn().mockResolvedValue([mockOrder]),
    findOne: jest.fn().mockResolvedValue(mockOrder),
    update: jest.fn().mockResolvedValue({ ...mockOrder, status: 'CANCELLED' }),
    remove: jest.fn().mockResolvedValue({ id: 1, deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: 1,
        items: [{ itemId: 1, quantity: 2 }],
      } as any;

      const result = await controller.create(createOrderDto);

      expect(service.create).toHaveBeenCalledWith(createOrderDto);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockOrder]);
    });
  });

  describe('findOne', () => {
    it('should return a single order by ID and parse string ID to number', async () => {
      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('update', () => {
    it('should update an order by ID and parse string ID to number', async () => {
      const updateOrderDto: UpdateOrderDto = { status: 'CANCELLED' } as any;

      const result = await controller.update('1', updateOrderDto);

      expect(service.update).toHaveBeenCalledWith(1, updateOrderDto);
      expect(result).toEqual({ ...mockOrder, status: 'CANCELLED' });
    });
  });

  describe('remove', () => {
    it('should delete an order by ID and parse string ID to number', async () => {
      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, deleted: true });
    });
  });
});
