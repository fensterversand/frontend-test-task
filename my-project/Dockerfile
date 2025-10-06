FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 8000

# Start development server
CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "8000"]
