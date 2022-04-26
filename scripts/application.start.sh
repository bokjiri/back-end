#!/bin/bash
sudo chmod -R 777 /home/ubuntu/build

#navigate into our working directory
cd /home/ubuntu/build

#start node server
pm2 start server.js
