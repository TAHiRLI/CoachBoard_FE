# Stage 1: Build the React + Vite app
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all project files
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN : "${VITE_API_URL:?VITE_API_URL build arg is required}" && echo ">>> VITE_API_URL=$VITE_API_URL"

ARG VITE_MINIO_URL
ENV VITE_MINIO_URL=$VITE_MINIO_URL
RUN : "${VITE_MINIO_URL:?VITE_MINIO_URL build arg is required}" && echo ">>> VITE_MINIO_URL=$VITE_MINIO_URL"

ARG VITE_DEPLOY_ENV
ENV VITE_DEPLOY_ENV=$VITE_DEPLOY_ENV
RUN : "${VITE_DEPLOY_ENV:?VITE_DEPLOY_ENV build arg is required}" && echo ">>> VITE_DEPLOY_ENV=$VITE_DEPLOY_ENV"

# Build the Vite project
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:stable-alpine AS production

# Copy the built project files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 92

CMD ["nginx", "-g", "daemon off;"]