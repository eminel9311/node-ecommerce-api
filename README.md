# NODEJS E-COMMERCE-API

## TECH STACK
- Node.js (ver 19.9) + Mongodb + mongoose
1. Install the required dependencies by running the following command:
<pre>
cd server
npm install
npm run dev
</pre>
## BUỔI 1
1. Install the required dependencies by running the following command:
<pre>
npm install typescript ts-node @types/node --save-dev
</pre>
2. Tạo tệp cấu hình TypeScript `tsconfig.json`
<pre>
npx tsc --init
</pre>
3. Mở tệp tsconfig.json và chỉnh sửa các giá trị sau:
<pre>
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "lib": ["es6"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "baseUrl": "./src",
    "paths": {
      "*": ["*", "src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
</pre>
4. Giải thích một số thư viện sử dụng trong project
<pre>
morgan: sử dụng để log thông tin request
helmet: ẩn các thông tin nhạy cảm của server
compression: nén dung lượng compress
</pre>

## BUỔI 2
1. Sử dụng singleton pattern để connect database
<pre>
class Database {
  static instance: Database;
  constructor() {
    this.connect();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  connect(_type = 'mongodb') {
    const mode = 1; //fake mode dev
    if (mode == 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
      mongoose.set('strictQuery', true);
    }
    const options = {
      autoIndex: true, // Don't build indexes
      maxPoolSize: 50, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      dbName: DB_NAME,
    };
    mongoose
      .connect(connectString, options)
      .then((_) => console.log(`Connected MongoDB Success`, countConnect()))
      .catch((err) => console.log(`Error Connect`, err));
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
  }
}
const instanceMongodb = Database.getInstance();
export default instanceMongodb;
</pre>

2. Kiểm tra hệ thống có bao nhiêu connect
<pre>
// count connect
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connection:: ${numConnection}`);
  return numConnection;
};
</pre>

3. Thông báo khi server quá tải
<pre>
const checOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Example maximum number of connections based on number of cores
    const maxConnections = numCores * 5;
    console.log(`Active connections::${numConnection}`)
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024}MB`)
    if(numConnection > maxConnections) {
      console.log(`Connection overload detected!`);
      //notify.send(...)
    }
  }, _SECONDS) // Monitor every 5 seconds
}
</pre>

4. Ở mongoose kết nối mongodb không cần đóng kết nối vì đã sử dụng pool
5. PoolSize là gì?
<pre>
  maxPoolSize: 50, // Maintain up to 10 socket connections
</pre>
- khi nào không sử dụng thì 50 connection sẽ nằm im, khi cần sử dụng sẽ được active lên để sử dụng.
- Nếu có quá nhiều kết nối vượt quá 50 connection thì các connection vượt quá thì sẽ phải xếp hàng,
  kết nối nào free thì mới được push vào để giải quyết