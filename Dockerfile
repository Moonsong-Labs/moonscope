# syntax = docker/dockerfile:1

# Use a specific version of bun as the base image
ARG BUN_VERSION=1.0.6
FROM oven/bun:${BUN_VERSION} as base

# Set the working directory inside the container
WORKDIR /app

# Set the environment to production
ENV NODE_ENV="production"

# Build stage to install dependencies and compile the app
FROM base as build

# Install necessary build tools
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy over the package file and lock file for dependency installation
COPY package.json bun.lockb ./
RUN bun install --ci

# Copy the rest of the application files
COPY . .

# Production stage - This will form the final image
FROM base

# Copy built application from the build stage
COPY --from=build /app /app

# Expose the App and API on ports 3000 & 3001
EXPOSE 3000
EXPOSE 3001

# The command to run the application
CMD [ "bun", "src/index.tsx" ]
