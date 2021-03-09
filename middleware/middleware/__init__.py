import os

from flask_cors import CORS
from flask import Flask

import middleware.custom_sqlalchemy as cs

app = Flask("seistech_web")
CORS(app)

# Connection details for the DB
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://{0}:{1}@{2}/{3}".format(
    os.environ["DB_USERNAME"],
    os.environ["DB_PASSWORD"],
    os.environ["DB_SERVER"],
    os.environ["DB_NAME"],
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = cs.CustomSQLALchemy(app)

print(db.Model, type(db.Model))

# See Circular Import section on here for some attempt at justification of this
# https://flask.palletsprojects.com/en/1.1.x/patterns/packages/
from middleware.api import core_api, project_api, intermediate_api
