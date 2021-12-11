# Coturn Server

- urls:
  + stun:call.metmes.pw:25001
  + turn:call.metmes.pw:25001

- generation user:
  + ```turnadmin -a -u USERNAME -r REALM -p PASSWORD```
  + ```turnadmin -a -u admin -r call.metmes.pw -p 123456```
  + acc: a_admin/a_admin_pwd, b_admin/b_admin_pwd

- port open:
  + 24999 (sshd)
  + 25001 (stun/turn)
  + 25002 - 25100