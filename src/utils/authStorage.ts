export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organization?: string;
  passwordHash: string;
  createdAt: string;
}

const STORAGE_KEY = 'ot_sec_registered_users';

export const DEMO_USER = {
  email: 'j.martinez@houston-refinery.local',
  name: 'J. Martinez',
  role: 'SecOps Tier 3 (OT Lead)',
  organization: 'Houston Refining Facility',
  password: 'Password123!',
};

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

export async function hashPassword(password: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(password);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback if subtle crypto fails
    }
  }

  // Deterministic fallback hash for environments where crypto.subtle is unavailable
  let hash = 5381;
  for (let i = 0; i < password.length; i++) {
    hash = (hash * 33) ^ password.charCodeAt(i);
  }
  return 'djb2_' + (hash >>> 0).toString(16);
}

export function getRegisteredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read registered users from localStorage:', err);
  }

  // Initialize with the demo user seeded
  const initialUsers: StoredUser[] = [
    {
      id: 'usr_demo_1',
      name: DEMO_USER.name,
      email: DEMO_USER.email.toLowerCase(),
      role: DEMO_USER.role,
      organization: DEMO_USER.organization,
      // Precomputed SHA-256 hash of 'Password123!'
      passwordHash: 'e6c27da48d6780c02f63303feed6016330b47cee0067da4eabbab86324f4737b',
      createdAt: new Date().toISOString(),
    },
  ];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
  } catch {
    // Storage quota or restricted environment
  }

  return initialUsers;
}

export function saveRegisteredUsers(users: StoredUser[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save registered users to localStorage:', err);
  }
}

export function findUserByEmail(email: string): StoredUser | null {
  const users = getRegisteredUsers();
  const normalized = email.trim().toLowerCase();
  return users.find(u => u.email.toLowerCase() === normalized) || null;
}

export async function registerNewUser(params: {
  fullName: string;
  email: string;
  role: string;
  organization?: string;
  password: string;
  confirmPassword: string;
}): Promise<{ success: boolean; error?: string; user?: { name: string; email: string; role: string } }> {
  const { fullName, email, role, organization, password, confirmPassword } = params;

  if (!fullName || !fullName.trim()) {
    return { success: false, error: 'Please enter your full name.' };
  }

  if (!email || !email.trim()) {
    return { success: false, error: 'Please enter your email.' };
  }

  if (!isValidEmail(email)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (!password) {
    return { success: false, error: 'Please enter your password.' };
  }

  if (password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters.' };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match.' };
  }

  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const passwordHash = await hashPassword(password);
  const newUser: StoredUser = {
    id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    name: fullName.trim(),
    email: email.trim().toLowerCase(),
    role: role || 'OT Security Analyst',
    organization: organization?.trim() || '',
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  const currentUsers = getRegisteredUsers();
  currentUsers.push(newUser);
  saveRegisteredUsers(currentUsers);

  return {
    success: true,
    user: {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  };
}

export async function authenticateUser(
  emailInput: string,
  passwordInput: string
): Promise<{ success: boolean; error?: string; user?: { name: string; email: string; role: string } }> {
  if (!emailInput || !emailInput.trim()) {
    return { success: false, error: 'Please enter your email.' };
  }

  if (!isValidEmail(emailInput)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (!passwordInput) {
    return { success: false, error: 'Please enter your password.' };
  }

  const user = findUserByEmail(emailInput);
  if (!user) {
    return { success: false, error: 'No account found with this email. Please sign up first.' };
  }

  const inputHash = await hashPassword(passwordInput);

  // Check if hash matches, or if it's the demo account matching DEMO_USER.password
  const isMatch = (inputHash === user.passwordHash) || 
    (user.email === DEMO_USER.email.toLowerCase() && passwordInput === DEMO_USER.password);

  if (!isMatch) {
    return { success: false, error: 'Incorrect email or password.' };
  }

  return {
    success: true,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
