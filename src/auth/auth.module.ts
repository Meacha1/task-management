import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    JwtModule.register({
    secret: 'secret',
    signOptions: { expiresIn: '1d' },
  }),
  PassportModule.register({ defaultStrategy: 'jwt' }),
],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
