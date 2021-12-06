FROM node:14.18.1

LABEL version="1.0"
LABEL description="Frontend Image"
LABEL maintainer = "jacobvraffe@gmail.com"

# RUN mkdir -p /client
WORKDIR /client
 
COPY . /client 

# Install all dependencies
RUN yarn install


EXPOSE 3001:3000

# Install app dependencies
CMD ["yarn", "deploy"]