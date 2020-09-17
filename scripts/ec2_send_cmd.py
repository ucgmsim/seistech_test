import pexpect
import sys
if len(sys.argv)< 4:
    print("Error: Usage: {} USERNAME PASSWORD CMD".format(sys.argv[0]))
    sys.exit()
USERNAME,PASSWORD = sys.argv[1:3]
CMD = " ".join(sys.argv[3:])
print(CMD)
child = pexpect.spawn("ssh {}@seistech.nz {}".format(USERNAME,CMD))
try:
    child.expect("yes/no", timeout=2) #first time ssh. if not first time, proceed after 2 secs  
except:
    pass
else:
    child.sendline("yes")
    print(child.before.decode("utf-8"))
try:
    child.expect("password: ")
except:
    pass
else:
    child.sendline(PASSWORD)
    print(child.before.decode("utf-8"))

#child.expect('.+')
try:
    child.expect('Permission denied', timeout=2)
except:
    pass
else:
    print("Permission denied. Can't login")
    child.kill(0)
print("Executed")
child.expect(pexpect.EOF, timeout=600)
print(child.before.decode("utf-8"))

