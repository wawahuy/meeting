FROM ubuntu:16.04

WORKDIR /root

COPY ./main/coturn.sh .
COPY ./main/sshd.sh .

RUN sh coturn.sh
RUN sh sshd.sh