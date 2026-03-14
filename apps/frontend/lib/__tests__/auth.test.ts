import { loginSchema } from '../validations/auth';

describe('Auth Validation Schema', () => {
    describe('loginSchema valid cases', () => {
        it('passes for valid phone and password', () => {
            const result = loginSchema.safeParse({ phone: '9876543210', password: 'password123' });
            expect(result.success).toBe(true);
        });

        it('passes for generic valid phone starting with 6', () => {
            const result = loginSchema.safeParse({ phone: '6000000000', password: 'abc123' });
            expect(result.success).toBe(true);
        });
    });

    describe('loginSchema invalid cases', () => {
        it('fails when phone starts with 1', () => {
            const result = loginSchema.safeParse({ phone: '1234567890', password: 'password123' });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Enter a valid Indian mobile number');
            }
        });

        it('fails when phone is too short', () => {
            const result = loginSchema.safeParse({ phone: '98765', password: 'password123' });
            expect(result.success).toBe(false);
            // It hits length(10) first (or minimum)
            const messages = result.success ? [] : result.error.issues.map(i => i.message);
            expect(messages).toContain('Must be exactly 10 digits');
        });

        it('fails when password is too short', () => {
            const result = loginSchema.safeParse({ phone: '9876543210', password: 'abc' });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Password must be at least 6 characters');
            }
        });

        it('fails when both fields are empty', () => {
            const result = loginSchema.safeParse({ phone: '', password: '' });
            expect(result.success).toBe(false);
            if (!result.success) {
                const paths = result.error.issues.map(i => i.path[0]);
                expect(paths).toContain('phone');
                expect(paths).toContain('password');
            }
        });
    });
});
