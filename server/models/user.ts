export class User {
  id: number;
  name: string;
  password: string;

  constructor(id: number, name: string, password: string) {
    this.id = id;
    this.name = name;
    this.password = password;
  }

  register(): void {
    console.log('User registered.');
  }

  login(): boolean {
    console.log('User logged in.');
    return true;
  }

  updateProfile(): void {
    console.log('Profile updated.');
  }
}
