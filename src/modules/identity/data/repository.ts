export type DemoRole = 'advertiser' | 'publisher' | 'ops';
export interface AuthSession { userId: string; email: string; role: DemoRole; }
export interface AuthRepository {
  login(email: string, password: string, role: DemoRole): Promise<AuthSession>;
  logout(): Promise<void>;
  current(): Promise<AuthSession | null>;
}
