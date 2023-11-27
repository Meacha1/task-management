import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credential.dto'
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
        private jwtService: JwtService,
    ) {}
    
    async signUp(AuthCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = AuthCredentialsDto;

        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
            try {
            await user.save();
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async signIn(AuthCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        const username = await this.validateUserPassword(AuthCredentialsDto);

        if (!username) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { username };
        const accessToken = await this.jwtService.sign(payload);

        return {accessToken};
    }

    async validateUserPassword(AuthCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = AuthCredentialsDto;
        const user = await this.entityManager.findOne(User, {where: {username: username}});

        if (user && await user.validatePassword(password)) {
            return user.username;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

}
