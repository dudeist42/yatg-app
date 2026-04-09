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
import { SessionsService } from '../../sessions/sessions.service';
import ms from 'ms';
import { SignUpDto } from './dto/sign-up.dto';
import bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { msToSeconds } from '../../../common/utils/time.utils';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    private config: ConfigType<typeof authConfig>,
    private jwtService: JwtService,
    private usersService: UsersService,
    private sessionsService: SessionsService,
  ) {}

  async signUp(dto: SignUpDto, meta: { ip?: string; deviceName?: string }) {
    const existing = await this.usersService.findByUsername(dto.username);
    if (existing) throw new ConflictException('Username already taken');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.usersService.createUser({
      username: dto.username,
      password: passwordHash,
    });

    return this.createTokenPair(user.id, user.username, meta);
  }

  async signIn(dto: SignInDto, meta: { ip?: string; deviceName?: string }) {
    const user = await this.usersService.findByUsername(dto.username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await this.usersService.validatePassword(
      user,
      dto.password,
    );
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return this.createTokenPair(user.id, user.username, meta);
  }

  async refresh(
    userId: string,
    oldSessionId: string,
    meta: { ip?: string; deviceName?: string },
  ) {
    await this.sessionsService.deleteSessionById(oldSessionId);

    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();

    return this.createTokenPair(user.id, user.username, meta);
  }

  async signOut(sessionId: string) {
    await this.sessionsService.deleteSessionById(sessionId);
  }

  async logoutAll(userId: string, excludeSessionId?: string) {
    await this.sessionsService.deleteSessionsByUserId(userId, excludeSessionId);
  }

  private async createTokenPair(
    userId: string,
    username: string,
    meta: { ip?: string; deviceName?: string },
  ) {
    const refreshTokenId = uuidv4();
    const accessTokenId = uuidv4();

    const refreshTokenExpiresIn = ms(this.config.jwtRefreshExpiresIn);
    const accessTokenExpiresIn = ms(this.config.jwtExpiresIn);

    const accessTokenExpiresAt = new Date(Date.now() + accessTokenExpiresIn);
    const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenExpiresIn);

    await this.sessionsService.saveSession({
      userId,
      refreshTokenId,
      accessTokenId,
      ipAddress: meta.ip,
      deviceName: meta.deviceName,
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
