// import { HttpException, Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User } from '../../schemas/user.schema';
// import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
// import { CreateUserDto } from '../dto/dto';
// import { EmailService } from './email.service';
// import { OAuth2Client } from 'google-auth-library';
// import { ConfigService } from 'src/config/config.service';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectModel(User.name) private userModel: Model<User>,
//     private jwtService: JwtService,
//     private emailService: EmailService,
//     private client: OAuth2Client,
//     private configService: ConfigService,
//   ) {}

//   private getSafeUser(user: User) {
//     const { password, otp, ...res } = user;
//     password;
//     otp;
//     return res;
//   }

//   async getUser(id: string) {
//     return this.getSafeUser((await this.userModel.findById(id)).toObject());
//   }

//   private async validateUser(email: string, pass: string): Promise<any> {
//     const user = (await this.userModel.findOne({ email })).toObject();
//     if (user && bcrypt.compareSync(pass, user.password)) {
//       const { password, ...result } = user;
//       password;
//       return result;
//     }
//     return null;
//   }

//   async login(user: { email: string; password: string }) {
//     const loggedInUser = await this.validateUser(user.email, user.password);

//     if (!loggedInUser) {
//       throw new HttpException('Invalid credentials', 400);
//     }

//     if (!loggedInUser.emailVerified) {
//       throw new HttpException('Email not verified', 400);
//     }

//     return {
//       access_token: this.jwtService.sign({ id: loggedInUser._id }),
//       ...this.getSafeUser(loggedInUser),
//     };
//   }

//   private createOtpAndExpiry() {
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpires = new Date(
//       new Date().getTime() + 60000 * 10,
//     ).toISOString();
//     return { otp, otpExpires };
//   }

//   async register(userDto: CreateUserDto) {
//     const hashedPassword = bcrypt.hashSync(userDto.password, 10);
//     const existingUser = await this.userModel.findOne({
//       email: userDto.email,
//     });

//     if (existingUser) {
//       throw new HttpException('User already exists', 400);
//     }

//     const createdUser = new this.userModel({
//       ...userDto,
//       password: hashedPassword,
//       ...this.createOtpAndExpiry(),
//     });

//     const user = (await createdUser.save()).toObject();
//     await this.emailService.verifyEmail(user);

//     // return this.getSafeUser(user);
//      return {
//        message:
//          'Registration successful. Please check your email for the verification OTP.',
//        user: this.getSafeUser(user),
//      };
//   }

//   private async findOrCreateGoogleUser(user: {
//     sub: string;
//     email: string;
//     name: string;
//     picture: string;
//     family_name: string;
//     given_name: string;
//   }): Promise<User> {
//     const existingUser = await this.userModel.findOne({
//       $or: [{ googleId: user.sub }, { email: user.email }],
//     });

//     if (existingUser) {
//       await this.userModel.updateOne({
//         googleId: user.sub,
//         emailVerified: true,
//       });
//       return (await this.userModel.findOne({ googleId: user.sub })).toObject();
//     }
//     const newUser = new this.userModel({
//       googleId: user.sub,
//       email: user.email,
//       displayName: user.name,
//       photoUrl: user.picture,
//       firstName: user.given_name,
//       lastName: user.family_name,
//       emailVerified: true,
//     });
//     const res = await newUser.save();
//     return res.toObject();
//   }

//   async verifyGoogleToken(token: string) {
//     const ticket = await this.client.verifyIdToken({
//       idToken: token,
//       audience: this.configService.googleClientId,
//     });
//     const payload = ticket.getPayload();

//     if (!payload) {
//       throw new Error('Invalid token');
//     }

//     const user = await this.findOrCreateGoogleUser({
//       sub: payload.sub,
//       family_name: payload.family_name,
//       given_name: payload.given_name,
//       email: payload.email,
//       picture: payload.picture,
//       name: payload.name,
//     });
//     return {
//       token: this.jwtService.sign({ userId: user.id }),
//       ...this.getSafeUser(user),
//     };
//   }

//   async verifyEmailOtp(otp: string, email: string) {
//     const user = await this.userModel.findOne({ email });
//     if (!user) {
//       throw new HttpException('Invalid OTP', 400);
//     }
//     const now = new Date();
//     if (now > new Date(user.otpExpires)) {
//       throw new HttpException('OTP expired', 400);
//     }
//     if (user.otp !== otp) {
//       throw new HttpException('Invalid OTP', 400);
//     }
//     user.emailVerified = true;
//     await user.save();
//     return {
//       message: 'Email verified',
//       status: true,
//     };
//   }

//   async resendOtp(email: string) {
//     const user = await this.userModel.findOne({ email });
//     if (!user) {
//       throw new HttpException('User not found', 400);
//     }
//     user.otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.otpExpires = new Date(new Date().getTime() + 60000 * 10).toISOString();
//     await user.save();
//     await this.emailService.verifyEmail(user.toObject());

//     return {
//       message: 'Email OTP sent successfully',
//       status: true,
//     };
//   }
// }


import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/dto';
import { EmailService } from './email.service';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private client: OAuth2Client,
    private configService: ConfigService,
  ) {}

  private getSafeUser(user: User) {
    const { password, otp, ...res } = user;
    password;
    otp;
    return res;
  }

  async getUser(id: string) {
    return this.getSafeUser((await this.userModel.findById(id)).toObject());
  }

  private async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = bcrypt.compareSync(pass, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Convert the Mongoose document to a plain object
    const userObject = user.toObject();
    const { password, ...result } = userObject;
    return result;
  }

  async login(user: { email: string; password: string }) {
    const loggedInUser = await this.validateUser(user.email, user.password);

    if (!loggedInUser) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (!loggedInUser.emailVerified) {
      throw new HttpException('Email not verified', HttpStatus.BAD_REQUEST);
    }

    return {
      access_token: this.jwtService.sign({
        id: loggedInUser._id,
        email: loggedInUser.email,
        role: loggedInUser.role,
      }),
      ...loggedInUser,
    };
  }

  private createOtpAndExpiry() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(
      new Date().getTime() + 60000 * 10,
    ).toISOString();
    return { otp, otpExpires };
  }

  async register(userDto: CreateUserDto) {
    const hashedPassword = bcrypt.hashSync(userDto.password, 10);
    const existingUser = await this.userModel.findOne({
      email: userDto.email,
    });

    if (existingUser) {
      throw new HttpException('User already exists', 400);
    }

    const createdUser = new this.userModel({
      ...userDto,
      password: hashedPassword,
      ...this.createOtpAndExpiry(),
    });
    const user = (await createdUser.save()).toObject();
    await this.emailService.verifyEmail(user);

    // return this.getSafeUser(user);
    return {
      message:
        'Registration successful. Please check your email for the verification OTP.',
      user: this.getSafeUser(user),
    };
  }

  private async findOrCreateGoogleUser(user: {
    sub: string;
    email: string;
    name: string;
    picture: string;
    family_name: string;
    given_name: string;
  }): Promise<User> {
    const existingUser = await this.userModel.findOne({
      $or: [{ googleId: user.sub }, { email: user.email }],
    });

    if (existingUser) {
      await this.userModel.updateOne({
        googleId: user.sub,
        emailVerified: true,
      });
      return (await this.userModel.findOne({ googleId: user.sub })).toObject();
    }
    const newUser = new this.userModel({
      googleId: user.sub,
      email: user.email,
      displayName: user.name,
      photoUrl: user.picture,
      firstName: user.given_name,
      lastName: user.family_name,
      emailVerified: true,
    });
    const res = await newUser.save();
    return res.toObject();
  }

  async verifyGoogleToken(token: string) {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: this.configService.googleClientId,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error('Invalid token');
    }

    const user = await this.findOrCreateGoogleUser({
      sub: payload.sub,
      family_name: payload.family_name,
      given_name: payload.given_name,
      email: payload.email,
      picture: payload.picture,
      name: payload.name,
    });
    return {
      token: this.jwtService.sign({ userId: user.id }),
      ...this.getSafeUser(user),
    };
  }

  async verifyEmailOtp(otp: string, email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('Invalid OTP', 400);
    }
    const now = new Date();
    if (now > new Date(user.otpExpires)) {
      throw new HttpException('OTP expired', 400);
    }
    if (user.otp !== otp) {
      throw new HttpException('Invalid OTP', 400);
    }
    user.emailVerified = true;
    await user.save();
    return {
      message: 'Email verified',
      status: true,
    };
  }

  async resendOtp(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('User not found', 400);
    }
    user.otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpExpires = new Date(new Date().getTime() + 60000 * 10).toISOString();
    await user.save();
    await this.emailService.verifyEmail(user.toObject());

    return {
      message: 'Email OTP sent successfully',
      status: true,
    };
  }
}
