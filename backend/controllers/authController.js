const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const axios = require("axios");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register user
const registerUser = async (req, res) => {
  try {
    const {
  businessName,
  ownerName,
  email,
  password,
  phone,
  businessCategory,
  location,
  accountType,
} = req.body;
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const adminEmails = [
      "mahi.kansara1904@gmail.com",
      "rishikashah2674@gmail.com",
    ];

    const role = adminEmails.includes(email.toLowerCase()) ? "admin" : "business";

    // Create user
    const user = await User.create({
  businessName,
  ownerName,
  email,
  password: hashedPassword,
  phone,
  businessCategory,
  location,
  accountType,
  role,
});
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        businessName: user.businessName,
        ownerName: user.ownerName,
        email: user.email,
        phone: user.phone,
        businessCategory: user.businessCategory,
        location: user.location,
        role: user.role,
        accountType: user.accountType,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Backend registration error details:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const adminEmails = [
      "mahi.kansara1904@gmail.com",
      "rishikashah2674@gmail.com",
    ];

    if (adminEmails.includes(user.email.toLowerCase()) && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    res.status(200).json({
      message: "Login successful",
      user: {
  _id: user._id,
  businessName: user.businessName,
  ownerName: user.ownerName,
  email: user.email,
  phone: user.phone,
  businessCategory: user.businessCategory,
  location: user.location,
  accountType: user.accountType,
  role: user.role,
},
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get logged-in user profile
const getProfile = async (req, res) => {
  res.status(200).json(req.user);
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.businessName = req.body.businessName || user.businessName;
    user.ownerName = req.body.ownerName || user.ownerName;
    user.phone = req.body.phone || user.phone;
    user.businessCategory = req.body.businessCategory || user.businessCategory;
    user.location = req.body.location || user.location;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
  _id: updatedUser._id,
  businessName: updatedUser.businessName,
  ownerName: updatedUser.ownerName,
  email: updatedUser.email,
  phone: updatedUser.phone,
  businessCategory: updatedUser.businessCategory,
  location: updatedUser.location,
  accountType: updatedUser.accountType,
  role: updatedUser.role,
},
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Change password from profile settings (no email authentication)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Encrypt and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Request password reset token (forgot password)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    // Generate random 6-digit reset token
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #4A7538; text-align: center; margin-bottom: 20px;">ReuseHub Password Recovery</h2>
        <p style="font-size: 14px; color: #4a5568; line-height: 1.6;">Hello,</p>
        <p style="font-size: 14px; color: #4a5568; line-height: 1.6;">We received a request to reset the password for your ReuseHub business account. Please use the verification code below to proceed:</p>
        <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px;">
          <span style="font-size: 11px; font-weight: bold; color: #a0aec0; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">Reset Verification Code</span>
          <span style="font-size: 28px; font-weight: 800; letter-spacing: 6px; color: #4A7538; font-family: monospace; display: block;">${resetToken}</span>
        </div>
        <p style="font-size: 13px; color: #718096; line-height: 1.6; margin-top: 20px;">This code will expire in 1 hour. If you did not make this request, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 25px 0;" />
        <p style="font-size: 11px; color: #a0aec0; text-align: center; margin: 0;">ReuseHub Circular Commerce Platform</p>
      </div>
    `;

    const emailSent = await sendEmail({
      to: email,
      subject: "ReuseHub Password Reset Code",
      text: `Your password reset code is: ${resetToken}`,
      html,
    });

    if (emailSent.simulated) {
      return res.status(200).json({
        success: true,
        message: "Password reset code generated (Simulated Mode).",
        token: resetToken,
        simulated: true,
      });
    }

    res.status(200).json({
      success: true,
      message: "Password reset code successfully sent to your email address.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset password using token
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Reset code and new password are required" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired password reset code" });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Clear reset tokens
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset completed successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Google SSO Authentication
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "Google ID Token is required" });
    }

    // Verify token with Google's public API
    let email, name, email_verified;
    try {
      const googleResponse = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      email = googleResponse.data.email;
      name = googleResponse.data.name;
      email_verified = googleResponse.data.email_verified;
    } catch (err) {
      console.error("Google token verification failed:", err.response?.data || err.message);
      return res.status(400).json({ message: "Invalid or expired Google credential token" });
    }

    if (!email || email_verified === "false") {
      return res.status(400).json({ message: "Google account email is not verified" });
    }

    let user = await User.findOne({ email });

    // Auto-register user if they don't exist yet (simulating seamless SSO creation)
    if (!user) {
      const adminEmails = [
        "mahi.kansara1904@gmail.com",
        "rishikashah2674@gmail.com",
      ];
      const role = adminEmails.includes(email.toLowerCase()) ? "admin" : "business";

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("GoogleSSOAutoCreatedUserPasswordTemp123", salt);

      user = await User.create({
        businessName: `${name} Business`,
        ownerName: name,
        email,
        password: hashedPassword,
        phone: "0000000000",
        businessCategory: "Other",
        location: "India",
        accountType: "supplier", // Default to supplier
        role,
      });
      console.log(`👤 [GOOGLE LOGIN] Created a new account for: ${email}`);
    }

    const adminEmails = [
      "mahi.kansara1904@gmail.com",
      "rishikashah2674@gmail.com",
    ];

    if (adminEmails.includes(user.email.toLowerCase()) && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    res.status(200).json({
      message: "Google login successful",
      user: {
        _id: user._id,
        businessName: user.businessName,
        ownerName: user.ownerName,
        email: user.email,
        phone: user.phone,
        businessCategory: user.businessCategory,
        location: user.location,
        accountType: user.accountType,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  googleLogin,
};