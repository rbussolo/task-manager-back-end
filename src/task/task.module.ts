import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { GroupService } from 'src/group/group.service';
import { GroupModule } from 'src/group/group.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UserModule, GroupModule],
  controllers: [TaskController],
  providers: [TaskService, UserService, GroupService],
})
export class TaskModule {}
