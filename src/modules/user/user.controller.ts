import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('userss')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Hamma userlarni olish' })
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @ApiOperation({ summary: 'Yagona userni olish' })
  @Get(':id')
  async getSingleUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getSingleUser(id);
  }

  @ApiOperation({ summary: 'User yaratish' })
  @Post()
  async createUser(@Body() payload: CreateUserDto): Promise<User> {
    return this.userService.createUser(payload);
  }

  @ApiOperation({ summary: 'Userni yangilash' })
  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, payload);
  }

  @ApiOperation({ summary: "Userni o'chirish" })
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.userService.deleteUser(id);
  }
}
