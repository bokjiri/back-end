#!/bin/bash
sudo chmod -R 777 /home/ubuntu/build

#navigate into our working directory
cd /home/ubuntu/build

#Stopping existing node servers
pm2 stop server.js