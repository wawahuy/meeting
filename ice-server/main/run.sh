#!/bin/bash

PORT_TURN=25001
PORT_MIN=25002
PORT_MAX=25100
REALM="call.zayuh.me"
turnserver -a -o -v -n  --no-dtls --no-tls -p $PORT_TURN -r $REALM --min-port=$PORT_MIN --max-port=$PORT_MAX

turnadmin -a -u a_admin -r call.zayuh.me -p a_admin_pwd
turnadmin -a -u b_admin -r call.zayuh.me -p b_admin_pwd

service ssh restart
service ssh status