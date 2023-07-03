'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const app_1 = __importDefault(require('./app'));
const PORT = 3055;
const server = app_1.default.listen(3055, () => {
  console.log(`Web service start with ${PORT}`);
});
process.on('SIGINT', () => {
  server.close(() => console.log(`Exit Server Express`));
});
