import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  const mockCustomer = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
  };

  const mockCustomerService = {
    create: jest.fn().mockResolvedValue(mockCustomer),
    findAll: jest.fn().mockResolvedValue([mockCustomer]),
    findOne: jest.fn().mockResolvedValue(mockCustomer),
    update: jest.fn().mockResolvedValue({ ...mockCustomer, name: 'Jane Doe' }),
    remove: jest.fn().mockResolvedValue({ id: 1, deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'John Doe',
        email: 'john@example.com',
        contact: '+1234567890',
      };

      const result = await controller.create(createCustomerDto);

      expect(service.create).toHaveBeenCalledWith(createCustomerDto);
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockCustomer]);
    });
  });

  describe('findOne', () => {
    it('should return a single customer by ID', async () => {
      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const updateCustomerDto: UpdateCustomerDto = { name: 'Jane Doe' };

      const result = await controller.update(1, updateCustomerDto);

      expect(service.update).toHaveBeenCalledWith(1, updateCustomerDto);
      expect(result).toEqual({ ...mockCustomer, name: 'Jane Doe' });
    });
  });

  describe('remove', () => {
    it('should delete a customer by ID', async () => {
      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, deleted: true });
    });
  });
});
