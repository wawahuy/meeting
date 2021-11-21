#!/bin/bash
# ************************
# * Script Config Corurn *
# ************************

apt-get update
apt-get install -y coturn
apt-get clean
rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

mv /etc/turnserver.conf /etc/turnserver.conf.original

# apt-get install -y software-properties-common
# add-apt-repository ppa:certbot/certbot
# apt update

# apt-get install -y certbot
# apt-get install -y python-certbot-nginx

# certbot --nginx -d stun.call.zayuh.me -d turn.call.zayuh.me