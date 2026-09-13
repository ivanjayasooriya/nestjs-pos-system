import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from './entities/order-detail.entity';
import { ItemModule } from '../item/item.module';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail]),
    ItemModule,
    CustomerModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
