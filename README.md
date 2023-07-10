# NODEJS E-COMMERCE-API

## TECH STACK

- Node.js (ver 19.9) + Mongodb + mongoose

1. Install the required dependencies by running the following command:
<pre>
cd server
npm install
npm run dev
</pre>

## NOTICE 1

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

## NOTICE 2

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

## NOTICE 3

1. Để khai báo một biến toàn cục trong typescript, hãy tạo 1 file `.d.ts` và sử dụng khai báo `declare global{}` để mở rộng đối tượng toàn cục.
Ở file `src/types/index.d.ts` trông như thế này
<pre>
/* eslint-disable no-var */

declare global {
var intervalIds: any;
}

export {};

</pre>

Lưu ý rằng chúng ta vẫn có thể gặp lỗi ở teminal nếu sử dụng `ts-node`.Để giải quyết vấn đề hãy sử dụng cờ `--files` với lệnh `ts-node`, vì vậy thay vì sử dụng lệnh sau
`ts-node ./src/index.ts` bạn nên chạy với lệnh `ts-node --files ./src/index.ts`.
Trong project này tôi sử dụng `nodemon` với `ts-node` và đây là nội dung file `nodeemon.json` được chỉnh sửa lại như sau:

<pre>
{
  "watch": ["src"],
  "ext": ".ts .js",
  "ignore": [],
  "exec": "ts-node --files ./src/server.ts"
}
</pre>

Bây giờ chúng ta có thể sử dụng biến global như đoạn code sau

<pre>
const listIntervalId = [];
listIntervalId.push(intervalId);
global.intervalIds = listIntervalId;
</pre>

Xem thêm tại đây: https://bobbyhadz.com/blog/typescript-declare-global-variable

## NOTICE 4

1. Tổng quan về xác thực token nâng cao
   ![Alt text](image.png)
Giải thích về kiến trúc. Ở đây tôi dev chức năng signup, ban đầu tạo service access để handle các yêu cầu về đăng nhập, đăng ký.
  - Khi user request signup, login
  - Server sử dụng thuật toán RSA để tạo 1 cặp private key và public key định dạng `.pem` là định dạng mã hõa binary.
  - Server lưu public key vào database, private key không cần lưu vào database.
  - Server sử dụng private key để ký lên payload để tạo ra 1 cặp tokens access-token và refresh-token.
  - Server gửi lại access-token và refresh-token cho client.
  - Client khi gửi request lên server thì gửi kèm với access-token.Server sử dụng public key được lưu ở database lên để verify.Nếu đúng thì thì user sẽ được sử dụng resource của hệ thống.
2. Cài đặt các thư viện
<pre>
  npm i crypto
  npm i jsonwebtoken

</pre>

3. Tạo cặp public key và private key
<pre>
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    }
  });
</pre>

4. Lưu public key vào database
<pre>
static createKeyToken = async ({ userId, publicKey }: any) => {
  try {
    //publicKey is buffer => convert to string
    const publicKeyString = publicKey.toString();
    const tokens = await keytokenModel.create({
      user: userId,
      publicKey: publicKeyString,
    });
    return tokens ? tokens.publicKey : null;
  } catch (error) {
    return error;
  }
};
</pre>

5. Khi lấy public key từ database lên phải convert sang kiểu buffer vì key đang được lưu ở định dạng string
<pre>
  const publicKeyObject = crypto.createPublicKey(publicKeyString);
</pre>

6. Tạo bộ access-token và refresh-token
<pre>
const createTokenPair = async (payload: any, publicKey: any, privateKey: any) => {
  try {
    // access token
    const accessToken = JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days',
    });
    // refresh token
    const refreshToken = JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7 days',
    });
    // verify
    JWT.verify(accessToken, publicKey, (err: any, decode: any) => {
      if (err) {
        console.log(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

</pre>