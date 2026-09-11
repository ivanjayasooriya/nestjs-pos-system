import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { In, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../item/entities/item.entity';
import { Transactional } from 'typeorm-transactional';
import { Customer } from '../customer/entities/customer.entity';
import { OrderDetail } from './entities/order-detail.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  @Transactional()
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { customerId, total, date, items } = createOrderDto;

    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    const itemIds = items.map((i) => i.itemId);
    const fetchedItems = await this.itemRepository.findBy({ id: In(itemIds) });

    if (fetchedItems.length !== itemIds.length) {
      throw new NotFoundException(
        'One or more items in the order were not found',
      );
    }

    const itemMap = new Map(fetchedItems.map((item) => [item.id, item]));
    const orderDetails: OrderDetail[] = [];

    for (const dtoItem of items) {
      const item = itemMap.get(dtoItem.itemId);

      if (!item) {
        throw new NotFoundException(`Item with ID ${dtoItem.itemId} not found`);
      }

      if (item.quantity < dtoItem.quantity) {
        throw new BadRequestException(
          `Insufficient stock for item "${item.name}". Available: ${item.quantity}, Requested: ${dtoItem.quantity}`,
        );
      }

      item.quantity -= dtoItem.quantity;

      const orderDetail = new OrderDetail();
      orderDetail.item = item;
      orderDetail.quantity = dtoItem.quantity;
      orderDetails.push(orderDetail);
    }

    await this.itemRepository.save(Array.from(itemMap.values()));

    const order = this.orderRepository.create({
      total,
      customer,
      orderDetails,
      ...(date && { date: new Date(date) }), // Only set date if provided
    });

    return await this.orderRepository.save(order);
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
