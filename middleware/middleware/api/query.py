import flask
from ..server import *


@app.route("/dbAPI/new_user", methods=["POST"])
def new_user():
    username = flask.request.args["username"]

    new_user = User(username)

    db.session.add(new_user)
    db.session.commit()

    return flask.jsonify({"New Username?": flask.request.args["username"]})


@app.route("/dbAPI/new_project", methods=["POST"])
def new_project():
    project_name = flask.request.args["projectname"]

    new_project = Project(project_name)

    db.session.add(new_project)
    db.session.commit()

    return flask.jsonify({"New Project?": flask.request.args["projectname"]})


# @app.route("/dbAPI/allocate_project", methods=["POST"])
# def allocate_project_to_user():


@app.route("/dbAPI/record_history", methods=["POST"])
def recored_history():
    # To find a userid
    username = flask.request.args["username"]
    user_id = User.query.filter_by(user_name=username).first().user_id

    # Add to History table
    endpoint = flask.request.args["endpoint"]
    new_history = History(user_id, endpoint)

    db.session.add(new_history)
    db.session.commit()

    # Get a current user's history id key
    history_id = History.query.filter_by(user_id=user_id).first().history_id

    # For History_Request with attribute and value
    attributes = flask.request.args["attribute"].split(",")
    values = flask.request.args["value"].split(",")

    for attribute, value in zip(attributes, values):
        new_history = History_Request(history_id, attribute, value)
        db.session.add(new_history)

    db.session.commit()

    return flask.jsonify({"New History?": "Added!"})
