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
    child.expect("yes/no")
except:
    pass
else:
    child.sendline("yes")
try:
    child.expect("password: ")
except:
    pass
else:
    child.sendline(PASSWORD)
#child.expect('.+')
i=child.expect(['Permission denied', pexpect.EOF])
if i==0:
    print("Permission denied. Can't login")
    child.kill(0)
elif i==1:
    print("Executed")
    print(child.before.decode("utf-8"))
