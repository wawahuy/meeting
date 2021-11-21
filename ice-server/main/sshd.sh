#!/bin/bash

apt-get upadate
apt-get install -y openssh-server

mkdir ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys