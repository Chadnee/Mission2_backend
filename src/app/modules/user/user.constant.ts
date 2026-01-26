export const USER_ROLE = {
    student: 'student',
    faculty : 'faculty',
    superAdmin: 'superAdmin',
    admin: 'admin',
} as const;

export const userSearchableFields = [
    'email',
    'role',
    
]
