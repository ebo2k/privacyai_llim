# Use the official Node.js image as the base image
FROM node:18.15.0 AS development

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the project files into the working directory
COPY . .

# Expose the port your application will run on (replace 3000 with your port number)
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "dev"]
