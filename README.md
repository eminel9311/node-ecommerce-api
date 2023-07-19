# NODEJS E-COMMERCE-API

https://github.com/github-linguist/linguist/blob/master/lib/linguist/languages.yml

## TECH STACK

- Node.js (ver 19.9) + Mongodb + mongoose

1. Cài đặt các gói yêu cầu:

```TypeScript
cd server
npm install
npm run dev
```

## NOTICE 1

1. Cài đặt các gói yêu cầu:

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


## NOTICE 4
1. Custom error response 
Để custom được error response đầu tiên phải viết handle ở phía dưới route
```TypeScript
// handling error app.ts
app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error: NotFoundRequestError = new NotFoundRequestError();
  next(error);
});

```
Đoạn code trên là 1 middleware tức là nếu thành công thì đi tiếp còn không thì làm gì tiếp theo.
Dưới đây là hàm để quản lý các error

```TypeScript
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: ErrorResponse, _req: Request, _res: Response, _next: NextFunction) => {
  const statusCode = error.status || 500;
  return _res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error',
  });
});
```
2. Tiếp theo viết class để xử lý các error
Vì Error được nodejs hỗ trợ sẵn nên chúng ta kế thừa nó để viết các hàm handle custom của chúng ta
```TypeScript
class ErrorResponse extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
```
Các hàm handle các lỗi khác nhau sẽ kế thừa `ErrorResponse` ở phía trên
```TypeScript
class ConflictRequestError extends ErrorResponse {
  constructor(
    message = HttpStatusCode.ReasonPhrases.CONFLICT,
    StatusCode = HttpStatusCode.StatusCodes.CONFLICT
  ) {
    super(message, StatusCode);
  }
}
```
3. Để sử dụng các method handle error chỉ cần khai báo và sử dụng như sau
```TypeScript
import { BadRequestError, ConflictRequestError } from '../core/error.response';

if (hodelShop) {
  throw new ConflictRequestError('Shop already registered!');
}
```
4. Tuy nhiên nếu code như trên nếu gặp lỗi thì app sẽ bị ném thẳng ra và dừng app, rất nguy hiểm vì vậy cần xử lý thêm để bắt được throw thì catch nó và in ra lỗi.Viết thêm 1 middleware để bao hàm xử lý throw ra lỗi như sau:
```TypeScript
const asyncHandler = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```
ở router access thêm đoạn code để handle throw như sau
```TypeScript
import { asyncHandler } from '../../auth/checkAuth';

accessRoute.post('/shop/signup', asyncHandler(AccessController.signUp));

```

## NOTICE 5
1. Để custom success response ta làm như sau:
- Tạo 1 class để handle các loại success
```TypeScript
class SuccessResponse {
  message: string;
  status: number;
  metadata: object;
  constructor({
    message,
    statusCode = HttpStatusCode.StatusCodes.OK,
    reasonStatusCode = HttpStatusCode.ReasonPhrases.OK,
    metadata = {},
  }: responseProperty) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  send(res: Response, _headers = {}) {
    return res.status(this.status).json(this);
  }
}
```

- đoạn mã return `res.status(this.status).json(this);` trong phương thức send của lớp SuccessResponse sẽ lấy tất cả các giá trị của đối tượng SuccessResponse và đưa chúng vào trong phản hồi HTTP (response) để gửi về client.

Khi phương thức send được gọi, nó sẽ thực hiện hai việc:

+ `res.status(this.status)`: Đặt mã trạng thái của phản hồi HTTP bằng giá trị của thuộc tính status trong đối tượng SuccessResponse. Điều này xác định mã trạng thái của phản hồi HTTP, ví dụ: 200 cho thành công, 404 cho không tìm thấy, vv.

+ `.json(this)`: Chuyển đối tượng SuccessResponse thành chuỗi JSON và gửi nó lại cho client thông qua phản hồi HTTP. Điều này cho phép client nhận được thông tin từ đối tượng SuccessResponse, bao gồm message, status, và metadata, dưới dạng dữ liệu JSON.

2. Viết riêng từng phương thức để xử lý các trường hợp success
```TypeScript
class CREATED extends SuccessResponse {
  options: object;
  constructor({
    options={},
    message,
    statusCode = HttpStatusCode.StatusCodes.CREATED,
    reasonStatusCode = HttpStatusCode.ReasonPhrases.CREATED,
    metadata = {},
  }: responseProperty) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}

```
3. Ở controller thì khai báo và sử dụng như sau
```TypeScript
import { CREATED } from '../core/success.response';

class AccessController {
  signUp = async (req: Request, res: Response) => {
    new CREATED({
      message: 'Regiserted OK!',
      metadata: await AccessService.signUp(req.body),
      options: {
        page: 1,
        limit: 10
      }
    }).send(res);
  };
}

```