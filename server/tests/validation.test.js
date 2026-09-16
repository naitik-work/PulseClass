const { signupSchema, loginSchema } = require('../src/validation/auth.schemas');
const {
  createInstituteSchema,
  joinInstituteSchema,
  createClassroomSchema,
  startSessionSchema,
} = require('../src/validation/app.schemas');

describe('Zod Validation Schemas', () => {
  describe('signupSchema', () => {
    it('accepts valid instructor registration', () => {
      const data = {
        name: 'Prof. Vikram',
        email: 'vikram@example.com',
        password: 'Password123!',
        role: 'instructor',
      };
      const result = signupSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('accepts valid student registration', () => {
      const data = {
        name: 'Aarav Patel',
        email: 'aarav@example.com',
        password: 'Password123!',
        role: 'student',
      };
      const result = signupSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const data = {
        name: 'Aarav',
        email: 'not-an-email',
        password: 'Password123!',
        role: 'student',
      };
      const result = signupSchema.safeParse(data);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/valid email/i);
    });

    it('rejects password shorter than 6 characters', () => {
      const data = {
        name: 'Aarav',
        email: 'aarav@example.com',
        password: '123',
        role: 'student',
      };
      const result = signupSchema.safeParse(data);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/6 characters/i);
    });

    it('rejects invalid role', () => {
      const data = {
        name: 'Aarav',
        email: 'aarav@example.com',
        password: 'Password123!',
        role: 'admin',
      };
      const result = signupSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('accepts valid login credentials', () => {
      const data = { email: 'user@example.com', password: 'password123' };
      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects missing password', () => {
      const data = { email: 'user@example.com' };
      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('createInstituteSchema', () => {
    it('accepts valid institute name', () => {
      const data = { name: 'Apex Institute of Technology' };
      const result = createInstituteSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects empty name', () => {
      const data = { name: '   ' };
      const result = createInstituteSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('joinInstituteSchema', () => {
    it('normalizes code to uppercase', () => {
      const data = { code: 'apex26' };
      const result = joinInstituteSchema.safeParse(data);
      expect(result.success).toBe(true);
      expect(result.data.code).toBe('APEX26');
    });

    it('rejects code exceeding 8 characters', () => {
      const data = { code: 'LONGERTHAN8' };
      const result = joinInstituteSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('createClassroomSchema', () => {
    it('accepts valid classroom payload', () => {
      const data = {
        name: 'CS101: Data Structures',
        instituteId: '507f1f77bcf86cd799439011',
      };
      const result = createClassroomSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects missing instituteId', () => {
      const data = { name: 'CS101' };
      const result = createClassroomSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('startSessionSchema', () => {
    it('accepts valid classroomId', () => {
      const data = { classroomId: '507f1f77bcf86cd799439011' };
      const result = startSessionSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
