import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tirm_id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.cars, { eager: true })
  user: User;
}
