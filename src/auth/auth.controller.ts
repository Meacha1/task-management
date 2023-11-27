import { Controller } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators';
import { AuthCredentialsDto } from './dto/auth-credential..dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}    
    
    @Post('/signup')
    signUp(@Body() authCredentialDto: AuthCredentialsDto) {
        return this.authService.signUp(authCredentialDto);
    }
}
