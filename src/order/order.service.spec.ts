import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { Item } from '../item/entities/item.entity';
import { Customer } from '../customer/entities/customer.entity';
import { CreateOrderDto } from './dto/create-order.dto';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => (target: any, key: any, descriptor: any) => descriptor,
}));

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<Order>;
  let itemRepository: Repository<Item>;
  let customerRepository: Repository<Customer>;

  const mockCustomer: Customer = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
  } as Customer;

  const mockItems: Item[] = [
    { id: 10, name: 'Coffee', quantity: 20 } as Item,
    { id: 20, name: 'Sandwich', quantity: 15 } as Item,
  ];

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockItemRepository = {
    findBy: jest.fn(),
    save: jest.fn(),
  };

  const mockCustomerRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(Item),
          useValue: mockItemRepository,
        },
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    itemRepository = module.get<Repository<Item>>(getRepositoryToken(Item));
    customerRepository = module.get<Repository<Customer>>(
      getRepositoryToken(Customer),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createOrderDto: CreateOrderDto = {
      customerId: 1,
      total: 25.5,
      date: new Date('2026-03-08T10:00:00.000Z'),
      items: [
        { itemId: 10, quantity: 2 },
        { itemId: 20, quantity: 1 },
      ],
    };

    it('should successfully create an order and update item stock', async () => {
      const itemsCopy = JSON.parse(JSON.stringify(mockItems));
      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockItemRepository.findBy.mockResolvedValue(itemsCopy);
      mockItemRepository.save.mockResolvedValue(itemsCopy);

      const expectedSavedOrder = {
        id: 100,
        total: 25.5,
        customer: mockCustomer,
        orderDetails: expect.arrayContaining([
          expect.objectContaining({ quantity: 2 }),
          expect.objectContaining({ quantity: 1 }),
        ]),
      };

      mockOrderRepository.create.mockImplementation((dto) => dto);
      mockOrderRepository.save.mockResolvedValue(expectedSavedOrder);

      const result = await service.create(createOrderDto);

      expect(mockCustomerRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockItemRepository.findBy).toHaveBeenCalled();
      expect(mockItemRepository.save).toHaveBeenCalled();
      expect(mockOrderRepository.create).toHaveBeenCalled();
      expect(result).toEqual(expectedSavedOrder);

      expect(itemsCopy[0].quantity).toBe(18);
      expect(itemsCopy[1].quantity).toBe(14);
    });

    it('should throw NotFoundException if customer does not exist', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createOrderDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createOrderDto)).rejects.toThrow(
        'Customer with ID 1 not found',
      );
    });

    it('should throw NotFoundException if any requested item is missing', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockItemRepository.findBy.mockResolvedValue([mockItems[0]]);

      await expect(service.create(createOrderDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createOrderDto)).rejects.toThrow(
        'One or more items in the order were not found',
      );
    });

    it('should throw BadRequestException if stock is insufficient', async () => {
      const lowStockItems = [{ id: 10, name: 'Coffee', quantity: 1 } as Item];

      const lowStockDto: CreateOrderDto = {
        ...createOrderDto,
        items: [{ itemId: 10, quantity: 5 }],
      };

      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockItemRepository.findBy.mockResolvedValue(lowStockItems);

      await expect(service.create(lowStockDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(lowStockDto)).rejects.toThrow(
        'Insufficient stock for item "Coffee". Available: 1, Requested: 5',
      );
    });
  });

  describe('findAll', () => {
    it('should return placeholder string', () => {
      expect(service.findAll()).toBe('This action returns all order');
    });
  });

  describe('findOne', () => {
    it('should return placeholder string with ID', () => {
      expect(service.findOne(5)).toBe('This action returns a #5 order');
    });
  });

  describe('update', () => {
    it('should return placeholder string with ID', () => {
      expect(service.update(5, {} as any)).toBe(
        'This action updates a #5 order',
      );
    });
  });

  describe('remove', () => {
    it('should return placeholder string with ID', () => {
      expect(service.remove(5)).toBe('This action removes a #5 order');
    });
  });
});
