import middleware.auth0 as auth0

from middleware import db
from middleware.models import *

# Create tables - It only creates when tables don't exist
db.create_all()
db.session.commit()

print(auth0.get_users())

# Need to be manually done as we cannot pull permission data from Auth0
PERMISSION_LIST = [
    "create-project",
    "edit-user",
    "hazard",
    "hazard:hazard",
    "hazard:disagg",
    "hazard:uhs",
    "hazard:gms",
    "project",
    "psha-admin",
]

# Adding all users from Auth0 to the User table
for key in auth0.get_users():
    db.session.add(User(key))
    db.session.commit()

# Adding all permission to the Auth0Permission table
for permission in PERMISSION_LIST:
    db.session.add(Auth0Permission(permission))
    db.session.commit()
