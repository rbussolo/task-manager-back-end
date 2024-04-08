import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export const TaskPriority = {
  Lower: 'Baixa',
  Medium: 'Média',
  High: 'Alta',
};

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.Lower,
    nullable: true,
  })
  priority: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({
    default: false,
  })
  completed: boolean;

  @Column({ nullable: true })
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: string;
}
