From node:0.10.30
MAINTAINER Philipz <philipzheng@gmail.com>

# Install NodeJS
RUN apt-get -qq update
# Install Library
RUN mkdir /MQTT
WORKDIR /MQTT
RUN npm install mqtt
RUN apt-get install -y libexpat1 libexpat1-dev libicu-dev
RUN npm install simple-xmpp

RUN echo "Asia/Taipei" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata
ADD alert.js /MQTT/
CMD ["/usr/local/bin/node", "alert.js"]
