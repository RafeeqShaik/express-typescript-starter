import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USERNAME as string,
    pass: process.env.SMTP_PASSWORD as string,
  },
});

export default (mailOptions: Mail.Options) => {
  transporter.sendMail({ ...mailOptions, from: process.env.SMTP_USERNAME as string }, (err) => {
    if (err) {
      throw new Error(err.message);
    } else {
      return { success: 'OK' };
    }
  });
};
