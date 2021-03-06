FROM node:9-alpine

# Create app directory
WORKDIR /var/www

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
RUN apk update && \
    apk upgrade && \
    apk add git

COPY package*.json ./

RUN npm install -p

RUN apk del git

# Bundle app source
COPY . .

# Build dist from src and discard src
RUN npm run dist

RUN npx rimraf src

# Go time!
CMD [ "npm", "run", "forever" ]
