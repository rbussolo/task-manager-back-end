import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { User } from 'src/user/user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { IUserPayload } from 'src/auth/auth.service';
import { ChagePositionGroup } from './dto/change-position-group.dto';

@Controller('/api/groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @User() user: IUserPayload) {
    return this.groupService.create(user, createGroupDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@User() user: IUserPayload) {
    return this.groupService.findAll(user);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOne(@Param('id') id: string, @User() user: IUserPayload) {
    return this.groupService.findOne(user, +id);
  }

  @UseGuards(AuthGuard)
  @Patch('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @User() user: IUserPayload,
  ) {
    return this.groupService.update(user, +id, updateGroupDto);
  }

  @UseGuards(AuthGuard)
  @Patch('/position')
  changePosition(
    @Body() positionGroupDto: ChagePositionGroup,
    @User() user: IUserPayload,
  ) {
    return this.groupService.changePosition(user, positionGroupDto);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  remove(@Param('id') id: string, @User() user: IUserPayload) {
    return this.groupService.remove(user, +id);
  }
}
