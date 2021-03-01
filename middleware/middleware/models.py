from datetime import datetime

import middleware.server as server


class AllowedProject(server.db.Model):
    __tablename__ = "allowed_project"
    user_id = server.db.Column(
        "user_id",
        server.db.String(100),
        server.db.ForeignKey("user.user_id"),
        primary_key=True,
    )
    project_id = server.db.Column(
        "project_id",
        server.db.Integer,
        server.db.ForeignKey("project.project_id"),
        primary_key=True,
    )

    user = server.db.relationship("User", back_populates="projects")
    project = server.db.relationship("Project", back_populates="users")

    def __init__(self, user_id, project_id):
        self.user_id = user_id
        self.project_id = project_id


class Project(server.db.Model):
    project_id = server.db.Column(server.db.Integer, primary_key=True)
    project_name = server.db.Column(server.db.String(100))

    users = server.db.relationship("AllowedProject", back_populates="project")

    def __init__(self, name):
        self.project_name = name

    def __repr__(self):
        return "<Project %r>" % self.project_name


class AllowedPermission(server.db.Model):
    __tablename__ = "allowed_permission"
    user_id = server.db.Column(
        "user_id",
        server.db.String(100),
        server.db.ForeignKey("user.user_id"),
        primary_key=True,
    )
    permission_name = server.db.Column(
        "permission_name",
        server.db.String(100),
        server.db.ForeignKey("auth0_permission.permission_name"),
        primary_key=True,
    )

    user = server.db.relationship("User", back_populates="permissions")
    permission = server.db.relationship("Auth0Permission", back_populates="users")

    def __init__(self, user_id, permission_name):
        self.user_id = user_id
        self.permission_name = permission_name


class Auth0Permission(server.db.Model):
    __tablename__ = "auth0_permission"
    permission_name = server.db.Column(server.db.String(100), primary_key=True)

    users = server.db.relationship("AllowedPermission", back_populates="permission")

    def __init__(self, permission_name):
        self.permission_name = permission_name

    def __repr__(self):
        return "<Permission to %r>" % self.permission_name


class User(server.db.Model):
    user_id = server.db.Column(server.db.String(100), primary_key=True)
    history = server.db.relationship("History", backref="owner")

    projects = server.db.relationship("AllowedProject", back_populates="user",)
    permissions = server.db.relationship("AllowedPermission", back_populates="user")

    def __init__(self, user_id):
        self.user_id = user_id

    def __repr__(self):
        return "<User %r>" % self.user_id


class History(server.db.Model):
    history_id = server.db.Column(server.db.Integer, primary_key=True)
    user_id = server.db.Column(
        server.db.String(100), server.db.ForeignKey("user.user_id")
    )
    endpoint = server.db.Column(server.db.String(100))
    date = server.db.Column(server.db.DateTime, default=datetime.now)
    history_requests = server.db.relationship("HistoryRequest", backref="record")

    def __init__(self, user_id, endpoint):
        self.user_id = user_id
        self.endpoint = endpoint


class HistoryRequest(server.db.Model):
    __tablename__ = "history_request"
    history_request_id = server.db.Column(server.db.Integer, primary_key=True)
    history_id = server.db.Column(
        server.db.Integer, server.db.ForeignKey("history.history_id")
    )
    attribute = server.db.Column(server.db.String(100))
    value = server.db.Column(server.db.String(100))

    def __init__(self, history_id, attribute, value):
        self.history_id = history_id
        self.attribute = attribute
        self.value = value
