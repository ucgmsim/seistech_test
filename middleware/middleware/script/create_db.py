import os

from flask import Flask

from ..custom_sqlalchemy import CustomSQLALchemy
from ..auth0 import get_users


# DB Connection Setup
DATABASE = "mysql+pymysql://{0}:{1}@{2}/{3}".format(
    os.environ["DB_USERNAME"],
    os.environ["DB_PASSWORD"],
    os.environ["DB_SERVER"],
    os.environ["DB_NAME"],
)

app = Flask("seistech_web")

# Connect to DB
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = CustomSQLALchemy(app)

from ..models import *

# Create tables - It only creates when tables don't exist
db.create_all()
db.session.commit()

print(get_users())

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
    "permission-config",
]

# Adding all users from Auth0 to the User table
for key in get_users():
    db.session.add(User(key))
    db.session.commit()

# Adding all permission to the PageAccessPermission table
for permission in PERMISSION_LIST:
    db.session.add(PageAccessPermission(permission))
    db.session.commit()
