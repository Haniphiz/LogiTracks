# Stage 1: Build assets
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # Ini jalankan Tailwind build dan copy HTML ke dist

# Stage 2: Serve dengan Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Optional: Copy custom nginx config jika perlu
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]