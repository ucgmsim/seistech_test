import os

from flask import Flask

from custom_sqlalchemy import CustomSQLALchemy


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

from models import *

# Create tables - It only creates when tables don't exist
db.create_all()
db.session.commit()
