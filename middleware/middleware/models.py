from datetime import datetime
from server import db


class AvailableProject(db.Model):
    __tablename__ = "available_project"
    user_id = db.Column(
        "user_id", db.String(100), db.ForeignKey("user.user_id"), primary_key=True
    )
    project_id = db.Column(
        "project_id", db.Integer, db.ForeignKey("project.project_id"), primary_key=True
    )

    user = db.relationship("User", back_populates="projects")
    project = db.relationship("Project", back_populates="users")

    def __init__(self, user_id, project_id):
        self.user_id = user_id
        self.project_id = project_id


class Project(db.Model):
    project_id = db.Column(db.Integer, primary_key=True)
    project_name = db.Column(db.String(100))

    users = db.relationship("AvailableProject", back_populates="project")

    def __init__(self, name):
        self.project_name = name

    def __repr__(self):
        return "<Project %r>" % self.project_name


class GrantedPermission(db.Model):
    __tablename__ = "granted_permission"
    user_id = db.Column(
        "user_id", db.String(100), db.ForeignKey("user.user_id"), primary_key=True
    )
    permission_name = db.Column(
        "permission_name",
        db.String(100),
        db.ForeignKey("page_access_permission.permission_name"),
        primary_key=True,
    )

    user = db.relationship("User", back_populates="permissions")
    permission = db.relationship("PageAccessPermission", back_populates="users")

    def __init__(self, user_id, permission_name):
        self.user_id = user_id
        self.permission_name = permission_name


class PageAccessPermission(db.Model):
    __tablename__ = "page_access_permission"
    permission_name = db.Column(db.String(100), primary_key=True)

    users = db.relationship("GrantedPermission", back_populates="permission")

    def __init__(self, permission_name):
        self.permission_name = permission_name

    def __repr__(self):
        return "<Permission to %r>" % self.permission_name


class User(db.Model):
    user_id = db.Column(db.String(100), primary_key=True)
    history = db.relationship("History", backref="owner")

    projects = db.relationship("AvailableProject", back_populates="user",)
    permissions = db.relationship("GrantedPermission", back_populates="user")

    def __init__(self, user_id):
        self.user_id = user_id

    def __repr__(self):
        return "<User %r>" % self.user_id


class History(db.Model):
    history_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), db.ForeignKey("user.user_id"))
    endpoint = db.Column(db.String(100))
    date = db.Column(db.DateTime, default=datetime.now)
    history_requests = db.relationship("HistoryRequest", backref="record")

    def __init__(self, user_id, endpoint):
        self.user_id = user_id
        self.endpoint = endpoint


class HistoryRequest(db.Model):
    __tablename__ = "history_request"
    history_request_id = db.Column(db.Integer, primary_key=True)
    history_id = db.Column(db.Integer, db.ForeignKey("history.history_id"))
    attribute = db.Column(db.String(100))
    value = db.Column(db.String(100))

    def __init__(self, history_id, attribute, value):
        self.history_id = history_id
        self.attribute = attribute
        self.value = value
