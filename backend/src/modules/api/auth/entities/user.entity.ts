export class User {
  id: string;
  username: string;
  sessionId: string;

  constructor(data: { id: string; username: string; sessionId: string }) {
    this.id = data.id;
    this.username = data.username;
    this.sessionId = data.sessionId;
  }
}
