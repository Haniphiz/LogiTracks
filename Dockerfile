FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
RUN npm i -g http-server
EXPOSE 9876
CMD ["http-server","dist","-p","9876"]