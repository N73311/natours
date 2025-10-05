FROM node:22-alpine

WORKDIR /app

# Install dependencies for sharp and other native modules
RUN apk add --no-cache vips vips-dev g++ make python3

# Copy package files
COPY package*.json ./

# Install dependencies and rebuild sharp for Alpine
RUN npm ci && \
    npm rebuild sharp

# Copy source code
COPY . .

EXPOSE 3000

# Environment variables for AWS SES
ENV USE_AWS_SES=true
ENV AWS_REGION=us-east-1
ENV EMAIL_FROM="Natours <natours@zachayers.io>"

CMD ["node", "server.js"]