FROM ubuntu:16.04

WORKDIR /root

COPY ./main/coturn.sh .
COPY ./main/sshd.sh .
COPY ./main/run.sh .

RUN sh coturn.sh
RUN sh sshd.sh

COPY ./main/sshd_config /etc/ssh/sshd_config
COPY ./keys/authorized_keys /root/.ssh/authorized_keys

#ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache

CMD ["sh", "run.sh"]
CMD ["sleep", "100000000"]