# NODEJS E-COMMERCE-API

## TECH STACK

- Node.js (ver 19.9) + Mongodb + mongoose

1. Install the required dependencies by running the following command:
```TypeScript
cd server
npm install
npm run dev
```

## NOTICE 1

1. Install the required dependencies by running the following command:
```TypeScript
npm install typescript ts-node @types/node --save-dev
```
2. Tạo tệp cấu hình TypeScript `tsconfig.json`
```TypeScript
npx tsc --init
```
3. Mở tệp tsconfig.json và chỉnh sửa các giá trị sau:
```TypeScript
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
```
4. Giải thích một số thư viện sử dụng trong project
```TypeScript
morgan: sử dụng để log thông tin request
helmet: ẩn các thông tin nhạy cảm của server
compression: nén dung lượng compress
```

## NOTICE 2

1. Sử dụng singleton pattern để connect database
```TypeScript
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
```

2. Kiểm tra hệ thống có bao nhiêu connect
```TypeScript
// count connect
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connection:: ${numConnection}`);
  return numConnection;
};
```

3. Thông báo khi server quá tải
```TypeScript
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
```

4. Ở mongoose kết nối mongodb không cần đóng kết nối vì đã sử dụng pool
5. PoolSize là gì?
```TypeScript
  maxPoolSize: 50, // Maintain up to 10 socket connections
```

- khi nào không sử dụng thì 50 connection sẽ nằm im, khi cần sử dụng sẽ được active lên để sử dụng.
- Nếu có quá nhiều kết nối vượt quá 50 connection thì các connection vượt quá thì sẽ phải xếp hàng,
  kết nối nào free thì mới được push vào để giải quyết

## NOTICE 3

1. Để khai báo một biến toàn cục trong typescript, hãy tạo 1 file `.d.ts` và sử dụng khai báo `declare global{}` để mở rộng đối tượng toàn cục.
Ở file `src/types/index.d.ts` trông như thế này
```TypeScript
/* eslint-disable no-var */

declare global {
var intervalIds: any;
}

export {};

```

Lưu ý rằng chúng ta vẫn có thể gặp lỗi ở teminal nếu sử dụng `ts-node`.Để giải quyết vấn đề hãy sử dụng cờ `--files` với lệnh `ts-node`, vì vậy thay vì sử dụng lệnh sau
`ts-node ./src/index.ts` bạn nên chạy với lệnh `ts-node --files ./src/index.ts`.
Trong project này tôi sử dụng `nodemon` với `ts-node` và đây là nội dung file `nodeemon.json` được chỉnh sửa lại như sau:

```TypeScript
{
  "watch": ["src"],
  "ext": ".ts .js",
  "ignore": [],
  "exec": "ts-node --files ./src/server.ts"
}
```

Bây giờ chúng ta có thể sử dụng biến global như đoạn code sau

```TypeScript
const listIntervalId = [];
listIntervalId.push(intervalId);
global.intervalIds = listIntervalId;
```

Xem thêm tại đây: https://bobbyhadz.com/blog/typescript-declare-global-variable
