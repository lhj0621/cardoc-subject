import { Car } from '../../cars/entities/car.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Tire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  front_width: number;

  @Column()
  front_aspect_ratio: number;

  @Column()
  front_wheel_size: number;

  @Column()
  rear_width: number;

  @Column()
  rear_aspect_ratio: number;

  @Column()
  rear_wheel_size: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => Car)
  @JoinColumn()
  car: Car;
}
