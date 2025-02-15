import { jwtDecode } from 'jwt-decode';

export class JwtUtils {
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  isValidToken(): boolean {
    try {
      const jwtDecoded = jwtDecode<{ exp: number }>(this.token);

      const currentTimestamp = Math.floor(Date.now() / 1000);

      return jwtDecoded.exp > currentTimestamp;
    } catch (error) {
      return false;
    }
  }

  getSubFromToken(): string | null {
    try {
      const jwtDecoded = jwtDecode<{ sub: string }>(this.token);
      return jwtDecoded.sub || null;
    } catch (error) {
      return null;
    }
  }
}
