# Stage 1: Build the application
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies first (added --legacy-peer-deps here)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy the rest of your application code
COPY . .

# Build the TypeScript production dist folder
RUN npm run build

# Stage 2: Production runtime environment
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only package files and install ONLY production dependencies (added --legacy-peer-deps here)
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps

# Pull the compiled JavaScript distribution folder from the builder stage
COPY --from=builder /app/dist ./dist

# Open your custom application port
EXPOSE 3333

# Start the NestJS backend
CMD ["node", "dist/main"]
