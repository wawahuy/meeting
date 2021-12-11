#!/bin/bash

acme.sh --issue -d metmes.pw -d api.metmes.pw -k 2048 --nginx

acme.sh --installcert -d metmes.pw -d api.metmes.pw \
--key-file /etc/nginx/ssl/metmes.pw/metmes.pw.key \
--fullchain-file /etc/nginx/ssl/metmes.pw/metmes.pw.cer \
--reloadcmd 'systemctl reload nginx.service'