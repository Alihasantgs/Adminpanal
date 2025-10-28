// Mock user data
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    avatar: 'A',
    role: 'admin',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    name: 'John Doe',
    avatar: 'J',
    role: 'user',
    createdAt: '2024-01-02'
  }
];

// Authentication service
export class AuthService {
  static login(email: string, password: string): User | null {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    return user || null;
  }

  static signup(email: string, password: string, name: string): User {
    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      name,
      avatar: name.charAt(0).toUpperCase(),
      role: 'user',
      createdAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return newUser;
  }

  static getUserById(id: string): User | null {
    return mockUsers.find(u => u.id === id) || null;
  }
}
