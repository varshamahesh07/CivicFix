import apiClient, { IS_DEMO_MODE } from './api';

const AUTH_USER_KEY = 'civicfix_current_user_v2';
const CITIZEN_DB_KEY = 'civicfix_registered_citizens_v2';
const AUTHORITY_DB_KEY = 'civicfix_registered_authorities_v2';

// Pre-seeded demo citizen
const DEFAULT_CITIZEN = {
  id: 'citizen-1',
  role: 'citizen',
  name: 'Aarav Sharma',
  age: 29,
  address: 'Flat 402, Shanti Nilaya, 5th Cross, Indiranagar',
  email: 'aarav.sharma@example.com',
  phone: '+91 98765 43210',
  registeredAt: '2026-10-15T10:00:00.000Z'
};

// Pre-seeded demo authority
const DEFAULT_AUTHORITY = {
  id: 'authority-1',
  role: 'authority',
  name: 'Commissioner Priya Nair',
  designation: 'Senior Municipal Commissioner',
  department: 'Central Civic Operations Command',
  employeeId: 'EMP-CIV-8842',
  email: 'priya.nair@civic.gov',
  phone: '+91 94480 99887',
  verificationStatus: 'Verified (Demo)',
  registeredAt: '2026-09-01T08:00:00.000Z'
};

export const authService = {
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch (err) {
      console.error('Failed reading user session', err);
    }
    return null;
  },

  setCurrentUser(user) {
    if (user) {
      // Never store raw passwords or sensitive credentials in storage
      const safeUser = { ...user };
      delete safeUser.password;
      delete safeUser.confirmPassword;
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser));
      localStorage.setItem('civicfix_auth_token', `demo-token-${user.role}-${Date.now()}`);
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem('civicfix_auth_token');
    }
  },

  // Citizen Login
  async loginCitizen(identifier, password) {
    if (!identifier || !password) {
      throw new Error('Please enter both your email or phone number and password.');
    }

    if (!IS_DEMO_MODE) {
      const response = await apiClient.post('/auth/citizen/login', { identifier, password });
      const user = response.data?.user || response.data;
      this.setCurrentUser(user);
      return user;
    }

    const cleanId = identifier.trim().toLowerCase();

    // Check pre-seeded citizen
    if (cleanId === DEFAULT_CITIZEN.email.toLowerCase() || cleanId === DEFAULT_CITIZEN.phone) {
      this.setCurrentUser(DEFAULT_CITIZEN);
      return DEFAULT_CITIZEN;
    }

    // Check local registered citizens
    const citizens = JSON.parse(localStorage.getItem(CITIZEN_DB_KEY) || '[]');
    const matched = citizens.find(
      (c) => c.email.toLowerCase() === cleanId || c.phone === cleanId
    );

    if (matched) {
      this.setCurrentUser(matched);
      return matched;
    }

    // In demo mode, if an unregistered email is entered with valid format, create a seamless demo user
    const newUser = {
      id: `citizen-${Date.now()}`,
      role: 'citizen',
      name: identifier.includes('@')
        ? identifier.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        : 'Active Citizen',
      age: 28,
      address: 'Neighborhood Ward 12',
      email: identifier.includes('@') ? identifier : `${identifier}@citizen.local`,
      phone: identifier.includes('@') ? '+91 98000 00000' : identifier,
      registeredAt: new Date().toISOString()
    };
    this.setCurrentUser(newUser);
    return newUser;
  },

  // Citizen Registration
  async registerCitizen(formData) {
    const { name, age, address, email, phone, password, confirmPassword, termsAgreed } = formData;

    if (!name?.trim()) throw new Error('Full name is required.');
    if (!age || Number(age) < 16) throw new Error('A minimum age of 16 is required for citizen reporting.');
    if (!address?.trim()) throw new Error('Address is required.');
    if (!email?.trim() || !/^\S+@\S+\.\S+$/.test(email)) throw new Error('Please provide a valid email address.');
    if (!phone?.trim() || phone.trim().length < 8) throw new Error('Please provide a valid phone number.');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.');
    if (password !== confirmPassword) throw new Error('Passwords do not match.');
    if (!termsAgreed) throw new Error('You must accept the privacy and account terms.');

    if (!IS_DEMO_MODE) {
      const res = await apiClient.post('/auth/citizen/register', formData);
      try {
        return await this.loginCitizen(formData.email, formData.password);
      } catch {
        const user = res.data?.user || res.data;
        this.setCurrentUser(user);
        return user;
      }
    }

    // Check duplicate in demo model
    const citizens = JSON.parse(localStorage.getItem(CITIZEN_DB_KEY) || '[]');
    const isDuplicate = citizens.some((c) => c.email.toLowerCase() === email.trim().toLowerCase());
    if (isDuplicate) {
      throw new Error('A citizen account with this email address already exists.');
    }

    const newCitizen = {
      id: `citizen-${Date.now()}`,
      role: 'citizen',
      name: name.trim(),
      age: Number(age),
      address: address.trim(),
      email: email.trim(),
      phone: phone.trim(),
      registeredAt: new Date().toISOString()
    };

    citizens.push(newCitizen);
    localStorage.setItem(CITIZEN_DB_KEY, JSON.stringify(citizens));

    this.setCurrentUser(newCitizen);
    return newCitizen;
  },

  // Authority Login
  async loginAuthority(identifier, password) {
    if (!identifier || !password) {
      throw new Error('Department email/ID and passkey are required.');
    }

    if (!IS_DEMO_MODE) {
      const response = await apiClient.post('/auth/authority/login', { identifier, password });
      const user = response.data?.user || response.data;
      this.setCurrentUser(user);
      return user;
    }

    const clean = identifier.trim().toLowerCase();

    // Check default authority
    if (clean === DEFAULT_AUTHORITY.email.toLowerCase() || clean === DEFAULT_AUTHORITY.employeeId.toLowerCase()) {
      this.setCurrentUser(DEFAULT_AUTHORITY);
      return DEFAULT_AUTHORITY;
    }

    // Check registered authorities in storage
    const authorities = JSON.parse(localStorage.getItem(AUTHORITY_DB_KEY) || '[]');
    const matched = authorities.find(
      (a) => a.email.toLowerCase() === clean || a.employeeId?.toLowerCase() === clean
    );

    if (matched) {
      this.setCurrentUser(matched);
      return matched;
    }

    // Generic demo authority session for test inputs
    const authUser = {
      ...DEFAULT_AUTHORITY,
      name: identifier.includes('@') ? identifier.split('@')[0] : identifier,
      email: identifier.includes('@') ? identifier : `${identifier}@civic.gov`
    };
    this.setCurrentUser(authUser);
    return authUser;
  },

  // Authority Registration (New!)
  async registerAuthority(formData) {
    const {
      name, designation, department, employeeId, idProofFileName,
      email, phone, password, confirmPassword
    } = formData;

    if (!name?.trim()) throw new Error('Full name is required.');
    if (!designation?.trim()) throw new Error('Official designation is required.');
    if (!department?.trim()) throw new Error('Department is required.');
    if (!employeeId?.trim()) throw new Error('Employee or authority ID number is required.');
    if (!idProofFileName) throw new Error('ID-proof document is required for verification.');
    if (!email?.trim() || !/^\S+@\S+\.\S+$/.test(email)) throw new Error('Valid official email address is required.');
    if (!phone?.trim() || phone.trim().length < 8) throw new Error('Valid phone number is required.');
    if (!password || password.length < 6) throw new Error('Passkey must be at least 6 characters.');
    if (password !== confirmPassword) throw new Error('Passkeys do not match.');

    if (!IS_DEMO_MODE) {
      const res = await apiClient.post('/auth/authority/register', formData);
      const user = res.data?.user || res.data;
      this.setCurrentUser(user);
      return user;
    }

    // Demo authority registration
    const authorities = JSON.parse(localStorage.getItem(AUTHORITY_DB_KEY) || '[]');
    const newAuthority = {
      id: `authority-${Date.now()}`,
      role: 'authority',
      name: name.trim(),
      designation: designation.trim(),
      department: department.trim(),
      employeeId: employeeId.trim(),
      email: email.trim(),
      phone: phone.trim(),
      idProofFileName,
      verificationStatus: 'Pending Official Review (Demo Approved)',
      registeredAt: new Date().toISOString()
    };

    authorities.push(newAuthority);
    localStorage.setItem(AUTHORITY_DB_KEY, JSON.stringify(authorities));

    this.setCurrentUser(newAuthority);
    return newAuthority;
  },

  // Profile update
  updateCitizenProfile(updatedFields) {
    const current = this.getCurrentUser();
    if (!current || current.role !== 'citizen') return null;

    const updated = { ...current, ...updatedFields };
    this.setCurrentUser(updated);

    // Update in stored DB as well
    const citizens = JSON.parse(localStorage.getItem(CITIZEN_DB_KEY) || '[]');
    const idx = citizens.findIndex((c) => c.id === current.id);
    if (idx !== -1) {
      citizens[idx] = { ...citizens[idx], ...updatedFields };
      localStorage.setItem(CITIZEN_DB_KEY, JSON.stringify(citizens));
    }
    return updated;
  },

  async logout() {
    if (!IS_DEMO_MODE) {
      try {
        await apiClient.post('/auth/logout');
      } catch {
        // Ignore logout errors
      }
    }
    this.setCurrentUser(null);
  },

  async quickDemoLogin(role) {
    if (!IS_DEMO_MODE) {
      if (role === 'citizen') {
        return await this.loginCitizen('citizen@demo.civicfix', 'Citizen@123');
      }
      if (role === 'authority') {
        return await this.loginAuthority('officer@demo.civicfix', 'Authority@123');
      }
    }
    if (role === 'citizen') {
      this.setCurrentUser(DEFAULT_CITIZEN);
      return DEFAULT_CITIZEN;
    }
    if (role === 'authority') {
      this.setCurrentUser(DEFAULT_AUTHORITY);
      return DEFAULT_AUTHORITY;
    }
    this.logout();
    return null;
  }
};
