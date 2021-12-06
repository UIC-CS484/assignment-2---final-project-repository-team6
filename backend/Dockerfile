FROM node:14.18.1

LABEL version="1.0"
LABEL description="Backend Image"
LABEL maintainer = "jraffe@uic.edu"
 
WORKDIR /server

# Bundle app source
COPY . /server

# Install app dependencies
RUN yarn install

# COPY . /server

EXPOSE 5001:5000
CMD ["yarn", "start"]