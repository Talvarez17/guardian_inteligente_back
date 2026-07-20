import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/entities/role.entity';
import { User } from '../users/entities/user.entity';

const ADMIN_ROLE_NAME = 'admin';
const ADMIN_EMAIL = 'a@a.com';
const ADMIN_PASSWORD = '@@HOla12';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async onApplicationBootstrap() {
    let adminRole = await this.roleRepository.findOne({ where: { name: ADMIN_ROLE_NAME } });

    if (!adminRole) {
      adminRole = await this.roleRepository.save(this.roleRepository.create({ name: ADMIN_ROLE_NAME }));
      this.logger.log(`Role "${ADMIN_ROLE_NAME}" created`);
    }

    const existingAdmin = await this.userRepository.findOne({ where: { email: ADMIN_EMAIL } });

    if (!existingAdmin) {
      const password = await bcrypt.hash(ADMIN_PASSWORD, 10);

      const admin = this.userRepository.create({
        name: 'Admin',
        first_last_name: 'Admin',
        email: ADMIN_EMAIL,
        password,
        role: adminRole,
      });

      await this.userRepository.save(admin);
      this.logger.log(`Admin user "${ADMIN_EMAIL}" created`);
    }
  }
}
