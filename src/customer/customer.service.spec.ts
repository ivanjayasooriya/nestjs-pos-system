import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

describe('CustomerService', () => {
  let service: CustomerService;
  let repository: Repository<Customer>;

  const mockCustomer: Customer = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    contact: '+1234567890',
  } as Customer;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    repository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'John Doe',
        email: 'john@example.com',
        contact: '+1234567890',
      };

      mockRepository.create.mockReturnValue(mockCustomer);
      mockRepository.save.mockResolvedValue(mockCustomer);

      const result = await service.create(createCustomerDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createCustomerDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockCustomer);
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      const mockCustomers = [mockCustomer];
      mockRepository.find.mockResolvedValue(mockCustomers);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockCustomers);
    });
  });

  describe('findOne', () => {
    it('should return a single customer by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockCustomer);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockCustomer);
    });

    it('should return null if customer is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a customer by id', async () => {
      const updateCustomerDto: UpdateCustomerDto = { name: 'Jane Doe' };
      const updateResult: UpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: 1,
      };

      mockRepository.update.mockResolvedValue(updateResult);

      const result = await service.update(1, updateCustomerDto);

      expect(mockRepository.update).toHaveBeenCalledWith(1, updateCustomerDto);
      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should delete a customer by id', async () => {
      const deleteResult: DeleteResult = {
        raw: [],
        affected: 1,
      };

      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(deleteResult);
    });
  });
});
