export class UserSession {
  id!: string;
  ipAddress!: string | null;
  deviceName!: string | null;
  createdAt!: Date;
  lastUsedAt!: Date;
}
