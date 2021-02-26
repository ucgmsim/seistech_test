import json
from collections import defaultdict

from flask import request

import server
import models
from auth0 import get_user_id


def write_request_details(endpoint, query_dict):
    """Record users' interaction into the DB

    Parameters
    ----------
    endpoint: string
        What users chose to do
        E.g., Hazard Curve Compute, UHS Compute, Disaggregation Compute...
    query_dict: dictionary
        It is basically a query dictionary that contains attribute and value
        E.g., Attribute -> Station
              value -> CCCC
    """
    # Finding an user_id from the token
    user_id = get_user_id()

    # Add to History table
    new_history = models.History(user_id, endpoint)
    server.db.session.add(new_history)
    server.db.session.commit()

    # Get a current user's history id key which would be the last row in a table
    latest_history_id = (
        models.History.query.filter_by(user_id=user_id)
        .order_by(models.History.history_id.desc())
        .first()
        .history_id
    )

    # For History_Request with attribute and value
    for attribute, value in query_dict.items():
        if attribute == "exceedances":
            # 'exceedances' value is comma-separated
            exceedances_list = value.split(",")
            for exceedance in exceedances_list:
                new_history = models.HistoryRequest(
                    latest_history_id, attribute, exceedance
                )
                server.db.session.add(new_history)
        else:
            new_history = models.HistoryRequest(latest_history_id, attribute, value)
            server.db.session.add(new_history)

    server.db.session.commit()


def get_all_projects_from_available_project_table():
    """Create an array form of available projects that are in the DB

    Similar to _get_projects_from_db except, this function is designed to pull
    every rows from Available_Project table.
    """
    # Get all available projects from the UserDB
    available_projects = models.AvailableProject.query.all()

    # To make a dictionary looks like
    # {
    #   userA: [ProjectA, ProjectB, ProjectC],
    #   userB: [ProjectA, ProjectB]
    # }
    available_projects_dict = defaultdict(list)

    for project in available_projects:
        available_projects_dict[project.user_id].append(project.project_id)

    return available_projects_dict


def filter_the_projects_for_dashboard(unfiltered_projects):
    """Get all the available projects we have from Project API
    And customize the way we want to return to the frontend for two reasons.
    1. For Table's header(will display the name of the project)
    2. We can use this dictionary to filter the table to tell they have permission

    Parameters
    ----------
    unfiltered_projects: dictionary
    """
    # Get all projects from the UserDB.
    all_projects = models.Project.query.all()

    # Create a dictionary with the following format
    # key = project_code (e.g., nzgl, soffitel,qtwn)
    # value = dictionary in form of
    # {project_id: project_full_name}
    # id is the primary key from the UserDB
    # full_name is the user friendly name for project, e.g. Generic New Zealand Locations
    all_projects = {
        project.project_name: {
            "project_id": project.project_id,
            "project_full_name": unfiltered_projects[project.project_name]["name"],
        }
        for project in all_projects
    }

    return all_projects


def _get_projects_from_db(user_id):
    """Create an array form of available projects that are in the DB

    Parameters
    ----------
    user_id: string
        user_id from Auth0 to identify the user
    """
    # Get all available projects that are allocated to this user.
    available_project_objs = (
        models.Project.query.join(models.AvailableProject)
        .filter((models.AvailableProject.user_id == user_id))
        .all()
    )

    # Create a list that contains Project IDs from DB (Allowed Projects)
    available_projects = [project.project_name for project in available_project_objs]

    return available_projects


def get_available_projects(user_id, available_projects_from_project_api):
    """Do cross-check for the projects.

    It finds available projects from the DB.
    (Available_Project that contains user_id and project_name.)
    After we get all the existing projects from the Project API.
    Then we compare [Available Projects] and [All the Existing Projects]
    to find the matching one.

    Parameters
    ----------
    user_id: str
        Auth0 user id

    available_projects_from_project_api: dictionary
        All the projects that the Project API returns
    """
    # Finding the available projects that are already allocated to the DB with a given user id.
    available_projects = _get_projects_from_db(user_id)

    # Get a list of Project IDs & Project Names from Project API (Available Projects)
    # Form of {project_id: {name : project_name}}
    all_projects_dicts = available_projects_from_project_api

    # Create an dictionary in a form of if users have a permission for a certain project
    # {project_id: project_name}
    all_projects = {
        api_project_id: api_project_name["name"]
        for api_project_id, api_project_name in all_projects_dicts.items()
        if api_project_id in available_projects
    }

    return all_projects


def get_addable_projects(requested_user_id, all_projects):
    """Similar to the get_available_projects above.

    get_available_projects is there to do the cross-check for the Project tab,
    compare DB and Project API to see whether users have permission to access.

    This function, get_addable_projects is for the Edit User feature in the frontend.
    It compares the projects between the DB and Project API.
    Then it returns the options that are not intersecting.
    E.g. DB says A, B, C Projects
    Project API says A, B, C, D, E

    Then this function will return D, E for the Frontend.

    Parameters
    ----------
    requested_user_id: string
        Selected user id from Edit User's User dropdown

    all_projects: dictionary
        All the projects that the Project API returns
    """
    # Finding the available projects that are already allocated to the DB with a given user id.
    available_projects = _get_projects_from_db(requested_user_id)

    # Get a list of Project IDs & Project Names from Project API (Available Projects)
    # Form of {project_id: {name : project_name}}
    all_projects_dicts = all_projects

    # Create an dictionary in a form of if users have a permission for a certain project
    # {project_id: project_name}
    all_addable_projects = {
        api_project_id: api_project_name["name"]
        for api_project_id, api_project_name in all_projects_dicts.items()
        if api_project_id not in available_projects
    }

    return all_addable_projects


def _is_user_in_db(user_id):
    """To check whether the given user_id is in the DB

    Parameters
    ----------
    user_id: string
        selected user's Auth0 id
    """
    return bool(models.User.query.filter_by(user_id=user_id).first())


def _add_user_to_db(user_id):
    """Add an user to the MariaDB if not exist

    Parameters
    ----------
    user_id: string
        selected user's Auth0 id
    """
    if not _is_user_in_db(user_id):
        server.db.session.add(models.User(user_id))
        server.db.session.commit()
        server.db.session.flush()
    else:
        print(f"User {user_id} already exists")


def _is_project_in_db(project_name):
    """To check whether the given project is in the DB

    Parameters
    ----------
    project_name: string
        A project code we use internally.
        E.g., gnzl, mac_raes, nzgs_pga, soffitel_qtwn...
    """
    return bool(models.Project.query.filter_by(project_name=project_name).first())


def _add_project_to_db(project_name):
    """Add a new project to the MariaDB if not exist

    Parameters
    ----------
    project_name: string
        A project code we use internally.
        E.g., gnzl, mac_raes, nzgs_pga, soffitel_qtwn...
    """
    if not _is_project_in_db(project_name):
        server.db.session.add(models.Project(project_name))
        server.db.session.commit()
        server.db.session.flush()
    else:
        print(f"Project {project_name} already exists")


def _is_permission_in_db(permission_name):
    """To check whether the given permission is in the DB

    Parameters
    ----------
    permission_name: string
        A permission name we use internally.
        E.g., hazard, hazard:hazard, project...
    """
    return bool(
        models.PageAccessPermission.query.filter_by(
            permission_name=permission_name
        ).first()
    )


def _add_permission_to_db(permission_name):
    """Add new permission to the MariaDB if not exist

    Parameters
    ----------
    permission_name: string
        A permission name we use internally.
        E.g., hazard, hazard:hazard, project...
    """
    if not _is_permission_in_db(permission_name):
        server.db.session.add(models.PageAccessPermission(permission_name))
        server.db.session.commit()
        server.db.session.flush()
    else:
        print(f"Project {permission_name} already exists")


def _add_available_project_to_db(user_id, project_name):
    """This is where we insert data to the bridging table, available_projects

    Parameters
    ----------
    user_id: string
        Selected user's Auth0 id
    project_name: string
        Selected project's project code.
        E.g., gnzl, mac_raes, nzgs_pga, soffitel_qtwn...
    """

    print(f"Check whether the project is in the DB, if not, add the project to the DB")
    if not _is_project_in_db(project_name):
        print(f"{project_name} is not in the DB so updating it.")
        _add_project_to_db(project_name)
        server.db.session.flush()

    # Find Find a project object with a given project_name to get its project id
    project_obj = models.Project.query.filter_by(project_name=project_name).first()

    server.db.session.add(models.AvailableProject(user_id, project_obj.project_id))
    server.db.session.commit()
    server.db.session.flush()


def allocate_projects_to_user():
    """Allocate projects to the chosen user"""
    data = json.loads(request.data.decode())

    requested_user_id = data["user_info"]["value"]
    requested_project_list = data["project_info"]

    print(f"Check whether the user is in the DB, if not, add the person to the DB")
    if not _is_user_in_db(requested_user_id):
        print(f"{requested_user_id} is not in the DB so updating it.")
        _add_user_to_db(requested_user_id)
        server.db.session.flush()

    for project in requested_project_list:
        _add_available_project_to_db(requested_user_id, project["value"])

    return "DONE"


def _remove_allocated_projects(user_id, project_name):
    """This is where we remove data from the bridging table, available_projects

    Parameters
    ----------
    user_id: string
        Selected user's Auth0 id
    project_name: string
        Selected project's project code.
        E.g., gnzl, mac_raes, nzgs_pga, soffitel_qtwn...
    """
    try:
        # Get the project id with the given project name
        certain_project_id = (
            models.Project.query.filter_by(project_name=project_name).first().project_id
        )
        available_projects_row = (
            models.AvailableProject.query.filter_by(user_id=user_id)
            .filter_by(project_id=certain_project_id)
            .first()
        )

        server.db.session.delete(available_projects_row)
        server.db.session.commit()
        server.db.session.flush()
    except:
        print("Something went wrong.")


def remove_projects_from_user():
    """Remove projects from the chosen user"""
    data = json.loads(request.data.decode())

    requested_user_id = data["user_info"]["value"]
    requested_project_list = data["project_info"]

    for project in requested_project_list:
        _remove_allocated_projects(requested_user_id, project["value"])

    return "DONE"


def _is_in_granted_permission(user_id, permission):
    """Check whether there is a row with given user_id & permission"""
    return bool(
        models.GrantedPermission.query.filter_by(user_id=user_id)
        .filter_by(permission_name=permission)
        .first()
    )


def _add_permission_to_db(user_id, permission):
    """This is where we insert data to the bridging table, granted_permission

    Parameters
    ----------
    user_id: string
        Selected user's Auth0 id
    permission: string
        Selected user's permission
        E.g., hazard, hazard:hazard, project...
    """
    print(
        f"Check whether the permission is in the DB, if not, add the permission to the DB"
    )
    if not _is_permission_in_db(permission):
        print(f"{permission} is not in the DB so updating it.")
        _add_permission_to_db(permission)
        server.db.session.flush()

    if not _is_in_granted_permission(user_id, permission):
        server.db.session.add(models.GrantedPermission(user_id, permission))
        server.db.session.commit()
        server.db.session.flush()
    else:
        print(f"{user_id} already has a permission with ${permission}")


def _remove_illegal_permission(user_id, illegal_permission):
    """granted_permission table is outdated, remove illegal permission to update the dashboard"""
    illegal_permission_row = (
        models.GrantedPermission.query.filter_by(user_id=user_id)
        .filter_by(permission_name=illegal_permission)
        .first()
    )

    server.db.session.delete(illegal_permission_row)
    server.db.session.commit()
    server.db.session.flush()


def _filter_granted_permission_table(user_id, trusted_permission_list):
    """Filtering the granted_permission table first

    If the access token has the permission of A, B, C but granted_permission table
    has the permission of A, B, C, D. Then remove the permission D from the
    granted_permission table as the token is the trusted source of permission.

    Parameters
    ----------
    user_id: string
        It will be used to find a list of permission with the function,
        _get_all_granted_permission_for_a_user(user_id)
    trusted_permission_list: list
        The list to be compared with the list of permission from granted_permission
        table
    """
    # Get a list of permission that are allocated to this user
    unfiltered_granted_permission_list = _get_all_granted_permission_for_a_user(user_id)

    for permission in unfiltered_granted_permission_list:
        if permission not in trusted_permission_list:
            _remove_illegal_permission(user_id, permission)


def update_granted_permission_table():
    """Insert users' granted permission to a table, Granted_Permission"""
    data = json.loads(request.data.decode())

    requested_user_id = data["user_id"]
    requested_permission_list = data["permission_list"]

    # Filter the granted_permission table first before we check/update
    _filter_granted_permission_table(requested_user_id, requested_permission_list)

    print(f"Check whether the user is in the DB, if not, add the person to the DB")
    if not _is_user_in_db(requested_user_id):
        print(f"{requested_user_id} is not in the DB so updating it.")
        _add_user_to_db(requested_user_id)
        server.db.session.flush()

    for permission in requested_permission_list:
        _add_permission_to_db(requested_user_id, permission)

    return "DONE"


def get_all_permission():
    """Read every row from Page_Access_Permission table"""
    # Get all available permission from the DB.
    all_permission_list = models.PageAccessPermission.query.all()

    # Return a list just with permission name
    return [permission.permission_name for permission in all_permission_list]


def _get_all_granted_permission_for_a_user(requested_user_id):
    """Read every row where the user_id = requested_user_id"""
    all_granted_permission_for_a_user_list = models.GrantedPermission.query.filter_by(
        user_id=requested_user_id
    ).all()

    return [
        permission.permission_name
        for permission in all_granted_permission_for_a_user_list
    ]


def get_all_granted_permission():
    """Read every row from Granted_Permission table"""
    # Get all granted permission from the DB.
    all_granted_permission_list = models.GrantedPermission.query.all()

    # return a list of a dictionary in the form of
    # {
    #   user_id: user_id,
    #   permission_name: [permission_name]
    # }
    granted_permission_dict = defaultdict(list)

    for permission in all_granted_permission_list:
        granted_permission_dict[permission.user_id].append(permission.permission_name)

    return granted_permission_dict
