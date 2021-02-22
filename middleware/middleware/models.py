from datetime import datetime
from server import db

# Bridging table between Project and User table
available_projects_table = db.Table(
    "available_projects",
    db.Column("user_id", db.String(100), db.ForeignKey("user.user_id")),
    db.Column("project_id", db.Integer, db.ForeignKey("project.project_id")),
)


class Project(db.Model):
    project_id = db.Column(db.Integer, primary_key=True)
    project_name = db.Column(db.String(100))

    def __init__(self, name):
        self.project_name = name

    def __repr__(self):
        return "<Project %r>" % self.project_name


class User(db.Model):
    user_id = db.Column(db.String(100), primary_key=True)
    history = db.relationship("History", backref="owner")
    # To create a connection between Project and available_projects table
    # By using lazy attribute with dynamic, instead of getting all the data to view, get a query to filter out
    projects = db.relationship(
        "Project",
        secondary=available_projects_table,
        backref=db.backref("allocate", lazy="dynamic"),
    )

    def __init__(self, user_id):
        self.user_id = user_id

    def __repr__(self):
        return "<User %r>" % self.user_id


class History(db.Model):
    history_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), db.ForeignKey("user.user_id"))
    endpoint = db.Column(db.String(100))
    date = db.Column(db.DateTime, default=datetime.now)
    history_requests = db.relationship("History_Request", backref="record")

    def __init__(self, user_id, endpoint):
        self.user_id = user_id
        self.endpoint = endpoint


class History_Request(db.Model):
    history_request_id = db.Column(db.Integer, primary_key=True)
    history_id = db.Column(db.Integer, db.ForeignKey("history.history_id"))
    attribute = db.Column(db.String(100))
    value = db.Column(db.String(100))

    def __init__(self, history_id, attribute, value):
        self.history_id = history_id
        self.attribute = attribute
        self.value = value
