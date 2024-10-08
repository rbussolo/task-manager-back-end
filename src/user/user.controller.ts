import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  UploadedFile,
  ParseFilePipe,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './user.decorator';
import { IUserPayload } from 'src/auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFileSizeValidator, UserFileTypeValidator } from './user.file';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

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
  @Patch('/password')
  updatePassword(
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
    @User() user: IUserPayload,
  ) {
    return this.userService.updatePassword(user, updateUserPasswordDto);
  }

  @UseGuards(AuthGuard)
  @Patch('/photo')
  @UseInterceptors(FileInterceptor('file'))
  photo(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new UserFileSizeValidator({ validate: true }),
          new UserFileTypeValidator({ validate: true }),
        ],
      }),
    )
    file: Express.Multer.File,
    @User() user: IUserPayload,
  ) {
    return this.userService.updatePhoto(user, file);
  }

  @UseGuards(AuthGuard)
  @Get()
  findOne(@User() user: IUserPayload) {
    return this.userService.findOne(user);
  }
}
