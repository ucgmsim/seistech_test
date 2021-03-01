import os

from jose import jwt
from flask_cors import CORS
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

CORS(app)

ENV = os.environ["ENV"]
JWT_SECRET = os.environ["CORE_API_SECRET"]
API_AUDIENCE = os.environ["API_AUDIENCE"]
ALGORITHMS = os.environ["ALGORITHMS"]

# To communicate with Management API
AUTH0_CLIENT_ID = os.environ["AUTH0_CLIENT_ID"]
AUTH0_CLIENT_SECRET = os.environ["AUTH0_CLIENT_SECRET"]
AUTH0_AUDIENCE = os.environ["AUTH0_AUDIENCE"]
AUTH0_GRANT_TYPE = os.environ["AUTH0_GRANT_TYPE"]
AUTH0_DOMAIN = os.environ["AUTH0_DOMAIN"]

# For DEV/EA/PROD with ENV
CORE_API_BASE = os.environ["CORE_API_BASE"]
# For Project API with ENV
PROJECT_API_BASE = os.environ["PROJECT_API_BASE"]

# Generate the coreAPI token
CORE_API_TOKEN = "Bearer {}".format(
    jwt.encode({"env": ENV}, JWT_SECRET, algorithm="HS256")
)
