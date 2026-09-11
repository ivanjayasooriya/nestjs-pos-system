import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

describe('ItemService', () => {
  let service: ItemService;
  let repository: Repository<Item>;

  const mockItem: Item = {
    id: 1,
    name: 'Espresso',
    price: 3.5,
    quantity: 100,
  } as Item;

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
        ItemService,
        {
          provide: getRepositoryToken(Item),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    repository = module.get<Repository<Item>>(getRepositoryToken(Item));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new item', async () => {
      const createItemDto: CreateItemDto = {
        name: 'Espresso',
        price: 3.5,
        quantity: 100,
      };

      mockRepository.create.mockReturnValue(mockItem);
      mockRepository.save.mockResolvedValue(mockItem);

      const result = await service.create(createItemDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createItemDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockItem);
      expect(result).toEqual(mockItem);
    });
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const mockItems = [mockItem];
      mockRepository.find.mockResolvedValue(mockItems);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockItems);
    });
  });

  describe('findOne', () => {
    it('should return a single item by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockItem);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockItem);
    });

    it('should return null if item is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an item by id', async () => {
      const updateItemDto: UpdateItemDto = { price: 4.0 };
      const updateResult: UpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: 1,
      };

      mockRepository.update.mockResolvedValue(updateResult);

      const result = await service.update(1, updateItemDto);

      expect(mockRepository.update).toHaveBeenCalledWith(1, updateItemDto);
      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should delete an item by id', async () => {
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
