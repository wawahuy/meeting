#!/bin/bash
# ************************
# * Script Config Corurn *
# ************************

apt-get update
apt-get install -y coturn
apt-get clean
rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*