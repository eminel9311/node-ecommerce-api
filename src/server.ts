import app from './app';

const PORT = process.env.PORT || 3056;
const server = app.listen(PORT, () => {
  console.log(`Web service start with ${PORT}`);
});

process.on('SIGINT', () => {
  const intervalIDs = global.intervalIds;
  if (intervalIDs && intervalIDs.length > 0) {
    intervalIDs.forEach(function (intervalID: number) {
      clearInterval(intervalID);
    });
    global.intervalIds = [];
  }
  server.close(() => console.log(`Exit Server Express`));
});
