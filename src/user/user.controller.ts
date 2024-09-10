import { Controller, Get, Post, Body, UseGuards, Patch, UploadedFile, ParseFilePipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './user.decorator';
import { IUserPayload } from 'src/auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFileSizeValidator, UserFileTypeValidator } from './user.file';

@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Patch()
  update(@Body() updateUserDto: UpdateUserDto, @User() user: IUserPayload) {
    return this.userService.update(user, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Patch('/photo')
  photo(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new UserFileSizeValidator({}),
        new UserFileTypeValidator({}),
      ],
    }),
  ) file: Express.Multer.File, @User() user: IUserPayload) {
    return this.userService.updatePhoto(user, file);
  }

  @UseGuards(AuthGuard)
  @Get()
  findOne(@User() user: IUserPayload) {
    return this.userService.findOne(user);
  }
}
