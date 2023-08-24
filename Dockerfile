# Use an official Node.js runtime as the base image
FROM --platform=linux/amd64 node:lts-alpine

# install simple http server for serving static content
RUN npm install -g http-server

# make the 'app' folder the current working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy all files from the project's root to the container
COPY . .

# Build the Vue.js app
RUN npm run build

# Expose the port your Vue.js app will run on
EXPOSE 8080

# Command to start the app in development mode when the container is run
CMD [ "http-server", "dist" ]