import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../order/entities/order.entity';
import { OrderDetail } from '../../order/entities/order-detail.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ unsigned: true })
  quantity: number;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.item)
  orderDetails: OrderDetail[];
}
