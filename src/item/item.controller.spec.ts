import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

describe('ItemController', () => {
  let controller: ItemController;
  let service: ItemService;

  const mockItem = {
    id: 1,
    name: 'Espresso',
    price: 3.5,
    stock: 100,
  };

  const mockItemService = {
    create: jest.fn().mockResolvedValue(mockItem),
    findAll: jest.fn().mockResolvedValue([mockItem]),
    findOne: jest.fn().mockResolvedValue(mockItem),
    update: jest.fn().mockResolvedValue({ ...mockItem, price: 4.0 }),
    remove: jest.fn().mockResolvedValue({ id: 1, deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        {
          provide: ItemService,
          useValue: mockItemService,
        },
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
    service = module.get<ItemService>(ItemService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new item', async () => {
      const createItemDto: CreateItemDto = {
        name: 'Espresso',
        price: 3.5,
        quantity: 100,
      };

      const result = await controller.create(createItemDto);

      expect(service.create).toHaveBeenCalledWith(createItemDto);
      expect(result).toEqual(mockItem);
    });
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockItem]);
    });
  });

  describe('findOne', () => {
    it('should return a single item by ID', async () => {
      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockItem);
    });
  });

  describe('update', () => {
    it('should update an item by ID', async () => {
      const updateItemDto: UpdateItemDto = { price: 4.0 };

      const result = await controller.update(1, updateItemDto);

      expect(service.update).toHaveBeenCalledWith(1, updateItemDto);
      expect(result).toEqual({ ...mockItem, price: 4.0 });
    });
  });

  describe('remove', () => {
    it('should delete an item by ID', async () => {
      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, deleted: true });
    });
  });
});
