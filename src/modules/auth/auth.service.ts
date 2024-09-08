import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { User } from 'src/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const token = this.jwtService.sign(
      { userId: user._id },
      { secret: process.env.JWT_SECRET_KEY },
    );
    return { user, token };
  }

  async signup(signupDto: SignupDto) {
    const { fname, lname, email, password, phone } = signupDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await new this.userModel({
      fname,
      lname,
      email,
      phone,
      password: hashedPassword,
    }).save();

    const token = this.jwtService.sign(
      { userId: user._id },
      { secret: process.env.JWT_SECRET_KEY },
    );
    return { user, token };
  }

  async forgetPassword(email: string) {
    // 1) Get user by email
    const user = await this.userModel.findOne({ email });
    if (!user)
      throw new NotFoundException(`There is no user with that email ${email}`);

    // 2) If user exist, Generate hash reset random 6 digits and save it in db
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');

    // Save hashed password reset code into db
    user.passwordResetCode = hashedResetCode;
    // Add expiration time for password reset code (10 min)
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetVerified = false;
    await user.save();

    const message = `Hi ${user.fname},\n We received a request to reset the password on your Prog. Area Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The Prog. Area Team`;
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset code (valid for 5 min)',
        message,
      });
    } catch (e) {
      console.error('Error sending email:', e); // Log the exact error
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      user.passwordResetVerified = undefined;
      await user.save();
      throw new BadRequestException('There is an error in sending email');
    }

    return {
      status: 'Success',
      message: 'Reset code sent to email, please check your email',
    };
  }

  async verifyResetCode(resetCode: string) {
    // 1) Get user based on reset code

    const hashedResetCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');

    const user = await this.userModel.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new NotFoundException('Reset code invalid or expired');
    }

    // 2) Reset code valid
    user.passwordResetVerified = true;
    await user.save();

    return { status: 'Success', message: 'Reset code verified' };
  }

  async resetPassword(body: any) {
    // 1) Get user based on email
    const user = await this.userModel.findOne({ email: body.email });

    if (!user) {
      throw new NotFoundException(`There is no user with email ${body.email}`);
    }

    // 2) Check if reset code verified
    if (!user.passwordResetVerified) {
      throw new NotFoundException('Reset code not verified');
    }

    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    user.password = hashedPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    // 3) if everything is ok, generate token
    const token = await this.jwtService.sign(
      { userId: user._id },
      { secret: process.env.JWT_SECRET_KEY },
    );

    return { user, token };
  }
}

// Nodemailer
const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
  // 1) Create transporter ( service that will send email like "gmail","Mailgun", "mialtrap", sendGrid)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: 'true',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define email options (like from, to, subject, email content)
  const mailOpts = {
    from: `Programming Area-shop App <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  try {
    await transporter.sendMail(mailOpts);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
