const User = require('../models/User');
const logger = require('../config/logger');

class AuthService {
  async register(userData) {
    const { email, password,FullName } = userData;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({
      email,
      password,
      FullName: FullName,
    });

    logger.info(`New user registered: ${email}`);

    return {
      user: {
        id: user._id,
        email: user.email,
        FullName: user.FullName,
      }
    };
  }

  async login(email, password) {
    // Find user
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    logger.info(`User logged in: ${email}`);

    return {

      user: {
        id: user._id,
        email: user.email,
        FullName: user.FullName,
      }
      
    };
  }

  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user || !user.isActive) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new AuthService();
