import os
import sys

deploy_name="psha-"
try:
    branch=sys.argv[1]
except:
    branch='master_devel' #assumed to be the default
try:
    deploy_name+=branch.split("master_")[1] #psha-ea, psha-devel ...
except IndexError: #not in master_* format
    if branch=='master':
        deploy_name='psha'
    else:
        deploy_name+="devel"
print(deploy_name)
