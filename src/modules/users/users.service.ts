import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ChangePassDTO } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RolesService } from '../roles/roles.service';


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { email: createUserDto.email }
    })
    if (existing) {
      throw new ConflictException('This email is already in use');
    }

    const role = await this.rolesService.findOneRole(createUserDto.roleId);

    const hashPass = await bcrypt.hash(createUserDto.password, 10);

    const { roleId, ...userData } = createUserDto;

    const user = this.usersRepository.create({
      ...userData,
      password: hashPass,
      role,
    })

    return this.usersRepository.save(user);
  }

  getAllUser(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findUser(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id }
    })

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, updateUser: UpdateUserDto): Promise<User> {
    const user = await this.findUser(id);

    const { roleId, ...updateData } = updateUser;

    Object.assign(user, updateData);

    if (roleId) {
      user.role = await this.rolesService.findOneRole(roleId);
    }

    return this.usersRepository.save(user);

  }

  async softDeleteUser(id: string): Promise<{ message: string }> {
    const user = await this.findUser(id);

    user.status = false;
    await this.usersRepository.save(user);

    return { message: 'User deleted successfully' };
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async changePassword(id: string, updatePass: ChangePassDTO): Promise<{ message: string }> {

    const user = await this.usersRepository.createQueryBuilder('user').addSelect('user.password').where('user.id = :id', { id }).getOne()

    if(!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(updatePass.currentPassword, user.password);
    if(!isMatch) {
      throw new UnauthorizedException('Current passwors in not correct');
    }

    user.password = await bcrypt.hash(updatePass.newPassword, 10);
    await this.usersRepository.save(user);

    return { message: 'Password changed successfully' };
  }

  async resetPassword(id: string, dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.findUser(id);

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.usersRepository.save(user);

    return { message: 'Password reset successfully' };
  }

}
