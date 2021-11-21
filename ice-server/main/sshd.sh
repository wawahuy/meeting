#!/bin/bash

apt-get update
apt-get install -y openssh-server

mkdir ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys