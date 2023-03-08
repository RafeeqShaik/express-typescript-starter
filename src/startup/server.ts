import { Express } from 'express';

export default function Server(app: Express) {
  const PORT = process.env.PORT || 80;

  // eslint-disable-next-line no-console
  const server = app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  return server;
}
