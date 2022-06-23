FROM node:16-alpine
WORKDIR /app
ENV DOTENV_FILE=.env
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
CMD ["yarn", "server"]