import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from './entities/order-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetail])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
