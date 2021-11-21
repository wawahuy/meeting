FROM ubuntu:16.04

WORKDIR /root

COPY ./main/coturn.sh .
COPY ./main/sshd.sh .

RUN sh coturn.sh
RUN sh sshd.sh

COPY ./main/sshd_config /etc/ssh/sshd_config
COPY ./keys/authorized_keys /root/.ssh/authorized_keys

RUN service ssh restart