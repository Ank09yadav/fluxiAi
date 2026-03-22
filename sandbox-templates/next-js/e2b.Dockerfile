FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y curl net-tools && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set standard app directory
WORKDIR /opt/app

# Install Next.js
RUN npx --yes create-next-app@latest . --yes --typescript --tailwind --eslint

# Initialize shadcn (minimal)
RUN npx --yes shadcn@latest init --yes -b base --force
RUN npx --yes shadcn@latest add button card input --yes

# Copy start script
COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

# Give 'user' (1000) permissions to EVERYTHING in the app dir
RUN chown -R 1000:1000 /opt/app

# Run as the 'user' for security and standard behavior
USER 1000

