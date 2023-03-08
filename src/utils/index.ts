import { customAlphabet, nanoid } from 'nanoid/async';
import bcrypt from 'bcryptjs';
import Otp from '@models/Otp';
import mimeTypes from 'mime-types';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import emailService from './emailService';
import moment from 'moment-timezone';

export const genUserId = customAlphabet('1234567890', 6);
export const genOtp = customAlphabet('1234567890', 4);
export const guestSerial = customAlphabet('1234567890', 5);
export const randomFileSuffix = customAlphabet('1234567890', 9);

export const genHashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

interface IgenOtpAndSendEmail {
  userId: string;
  toEmail: string;
  emailText: string;
  emailSubject: string;
  otp: string;
}
export const genOtpAndSendEmail = async ({ userId, toEmail, emailText, emailSubject, otp }: IgenOtpAndSendEmail) => {
  await new Otp({ otp, user: userId }).save();
  emailService({
    from: process.env.SMTP_USERNAME as string,
    to: toEmail,
    subject: emailSubject,
    text: emailText,
  });
};

export const dayStartEnd = (date: string | Date | number) => {
  const dayStart = new Date(date);
  const dayEnd = new Date(date);

  dayStart.setHours(0);
  dayStart.setMinutes(0);
  dayStart.setSeconds(0);
  dayEnd.setHours(23);
  dayEnd.setMinutes(59);
  dayEnd.setSeconds(59);

  return { dayStart, dayEnd };
};

export const dateToMYTimeZone = {
  displayDate: (date: Date | string) => moment.tz(date, 'Asia/Kuala_Lumpur').format('DD/MM/YYYY'),
};

export const createFileuploadPath = async (prefix: string, file: UploadedFile) => {
  const ext = mimeTypes.extension(file.mimetype).toString();
  const rand = await nanoid();
  const filename = `${prefix}-${rand}.${ext}`;

  const fullPath = `${__dirname}/../public/${filename}`;
  file.mv(fullPath);
  return { fullPath, filename };
};

export const deleteFile = async (filename: string) => {
  const path = `${__dirname}/../public/${filename}`;
  fs.unlink(path, (err) => {
    // eslint-disable-next-line no-console
    if (err) console.log(err);
  });
};
