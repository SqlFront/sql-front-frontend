# Vite 7 in yarn.lock requires Node.js 20.19+ or 22.12+.
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN yarn build

# Expose the port the app runs on
EXPOSE 9000

# Start the application
CMD ["yarn", "start"]
