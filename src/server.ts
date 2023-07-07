import app from './app';

const PORT = process.env.PORT || 3056;
const server = app.listen(PORT, () => {
  console.log(`Web service start with ${PORT}`);
});

process.on('SIGINT', () => {
  const intervalIDs = global.intervalIds;
  intervalIDs.forEach(function (intervalID: number) {
    console.log('intervalID', intervalID)
    clearInterval(intervalID);
  });
  global.intervalIds = [];
  server.close(() => console.log(`Exit Server Express`));
});
