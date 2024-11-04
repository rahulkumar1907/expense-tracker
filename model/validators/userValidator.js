import { body } from 'express-validator';

const validateUser = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('age').optional().isInt({ min: 0 }).withMessage('Age must be a non-negative integer'),
  body('title').optional().isIn(['Mr', 'Mrs', 'Miss']).withMessage('Invalid title'),
];

export { validateUser };
