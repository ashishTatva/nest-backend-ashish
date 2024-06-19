import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { CustomerModule } from 'src/customer/customer.module';
import { AccessTokenStrategy } from './access-token.strategy';

@Module({
  imports: [PassportModule, CustomerModule, JwtModule.register({})],
  providers: [AuthService, LocalStrategy, AccessTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
