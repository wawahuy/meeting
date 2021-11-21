#!/bin/bash

apt-get upadate
apt install openssh-server -y
apt install nano -y

mkdir ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys