import { Group } from 'src/group/entities/group.entity';
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
  due_date: Date;

  @Column({
    default: false,
  })
  completed: boolean;

  @Column({ nullable: true })
  completed_date: Date;

  @Column({
    default: false,
  })
  important: boolean;

  @Column()
  user_id: number;

  @Column({ nullable: true })
  group_id: number;

  @ManyToOne(() => Group, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: string;
}
