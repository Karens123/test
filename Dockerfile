FROM mhart/alpine-node:latest
WORKDIR /app
ADD package.json /app/
ADD npm-shrinkwrap.json /app/
RUN apk update && apk add bash
RUN npm config set registry http://r.cnpmjs.org/
#RUN npm config set registry https://registry.npm.taobao.org
#RUN npm info underscore
RUN npm install --production
ADD . /app
EXPOSE 3000
CMD ["npm", "start"]