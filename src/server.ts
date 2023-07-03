import app from './app';

const PORT = 3055;
const server = app.listen(3055, () => {
  console.log(`Web service start with ${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => console.log(`Exit Server Express`));
});
