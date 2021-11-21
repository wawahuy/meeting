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

PORT_TURN=25001
PORT_MIN=25002
PORT_MAX=25002
#PORT_CLI=24999
REALM="call.zayuh.me"
#PASSWORD_CLI="adadad"
#--cli-port=$PORT_CLI --cli-password=$PASSWORD_CLI --cli-ip=0.0.0.0
turnserver -a -o -v -n  --no-dtls --no-tls -p $PORT_TURN -r $REALM --min-port=$PORT_MIN --max-port=$PORT_MAX

turnadmin -a -u a_admin -r call.zayuh.me -p a_admin_pwd
turnadmin -a -u b_admin -r call.zayuh.me -p b_admin_pwd