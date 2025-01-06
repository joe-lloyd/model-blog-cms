# Frontend Dockerfile
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the frontend
RUN npm run build

# Ensure the `.next` directory and `public` assets are copied
COPY .next ./.next
COPY public ./public

# Expose the frontend port
EXPOSE 3000

# Serve the application
CMD ["npm", "run", "start"]
