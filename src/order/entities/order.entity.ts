import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderDetail } from './order-detail.entity';
import { Customer } from '../../customer/entities/customer.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    cascade: true,
  })
  orderDetails: OrderDetail[];
}
