
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Install tailwind + postcss + autoprefixer
RUN npm install -D tailwindcss postcss autoprefixer

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]

