/* eslint-disable no-console */
import mongoose from 'mongoose';

const db = process.env.DATABASE;

mongoose.set('strictQuery', false);
mongoose
  .connect(db as string)
  .then(() => {
    console.log('connection established');
  })
  .catch((err) => {
    console.log(err);
  });

mongoose.connection.on('connected', () => {
  console.log('connected to mongodb');
});

mongoose.connection.on('error', (err) => {
  console.error(err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('DISCONNECTED from mongoose ');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
