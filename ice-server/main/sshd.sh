#!/bin/bash

apt-get upadate
apt-get install openssh-server -y

mkdir ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys