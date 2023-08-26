# Use the official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for efficient dependency installation
COPY package.json package-lock.json ./

# Install production dependencies and clean up cache
RUN npm ci --production && npm cache clean --force

# Copy all files from the root directory of your local project to the container
COPY . .

# Expose the port on which your Node.js application will be running (change if needed)
EXPOSE 3000

# Set the NODE_ENV environment variable to "production"
ENV NODE_ENV production

# Start the Node.js application
CMD ["node", "bin/www"]
