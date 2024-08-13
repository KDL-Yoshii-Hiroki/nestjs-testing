# api/Dockerfile
# Node.jsのバージョンを指定
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# パッケージ.jsonとパッケージ.lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# アプリケーションがリッスンするポートを指定
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "run", "start:dev"]