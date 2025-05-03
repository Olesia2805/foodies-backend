# Dockerfile for Backend
FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
RUN npm install cloudinary
RUN npm install multer-storage-cloudinary
RUN npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]