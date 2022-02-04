FROM node:16-alpine
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]