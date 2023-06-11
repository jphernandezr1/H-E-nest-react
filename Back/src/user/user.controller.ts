import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseGuards,
    Req
} from '@nestjs/common';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { UserService } from "./user.service";
import { Role } from "../shared/security/role.enum";
import { Roles } from "../shared/security/roles.decorator";
import { AuthService } from '../auth/auth.service';
import { User } from './user';
import { UserDTO } from './user.dto';
import { plainToInstance } from 'class-transformer';
import { RoleGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')

export class UserController {

    constructor(private readonly authService: AuthService, private readonly userService: UserService) { }
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req) {
        return this.authService.login(req);
    }
    
    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Post()
    async create(@Body() userDto: UserDTO) {
        const user: User = plainToInstance(User, userDto);
        return await this.userService.create(user);
    }

    @Get()
    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    async findAll() {
        return await this.userService.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    async findOne(@Param('id') id: string) {
        return await this.userService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    async update(@Param('id') id: string, @Body() userDto: UserDTO) {
        const user: User = plainToInstance(User, userDto);
        return await this.userService.update(user);
    }


}