import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { type ConfigType } from '@nestjs/config';
import { authConfig } from './auth.config';
import ms from 'ms';
import { SignUpDto } from './dto/sign-up.dto';
import bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { msToSeconds } from '../../../common/utils/time.utils';
import { SessionsRepository } from '../sessions/sessions.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    private config: ConfigType<typeof authConfig>,
    private jwtService: JwtService,
    private usersService: UsersService,
    private sessionsRepository: SessionsRepository,
  ) {}

  async signUp(dto: SignUpDto) {
    const existing = await this.usersService.findByUsername(dto.username);
    if (existing) throw new ConflictException('Username already taken');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.usersService.createUser({
      username: dto.username,
      password: passwordHash,
    });

    return this.createTokenPair(user.id, user.username);
  }

  async signIn(dto: SignInDto) {
    const user = await this.usersService.findByUsername(dto.username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await this.usersService.validatePassword(
      user,
      dto.password,
    );
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return this.createTokenPair(user.id, user.username);
  }

  async refresh(userId: string, oldSessionId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();

    return this.createTokenPair(user.id, user.username, {
      id: oldSessionId,
    });
  }

  async signOut(sessionId: string) {
    await this.sessionsRepository.deleteSessionById(sessionId);
  }

  private async createTokenPair(
    userId: string,
    username: string,
    meta?: { id?: string },
  ) {
    const refreshTokenId = uuidv4();
    const accessTokenId = uuidv4();

    const refreshTokenExpiresIn = ms(this.config.jwtRefreshExpiresIn);
    const accessTokenExpiresIn = ms(this.config.jwtExpiresIn);

    const accessTokenExpiresAt = new Date(Date.now() + accessTokenExpiresIn);
    const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenExpiresIn);

    await this.sessionsRepository.saveSession({
      id: meta?.id,
      userId,
      refreshTokenId,
      accessTokenId,
      expiresAt: refreshTokenExpiresAt,
    });

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username, jti: accessTokenId },
        {
          secret: this.config.jwtSecret,
          expiresIn: msToSeconds(accessTokenExpiresIn),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, username, jti: refreshTokenId },
        {
          secret: this.config.jwtRefreshSecret,
          expiresIn: msToSeconds(refreshTokenExpiresIn),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    };
  }
}
