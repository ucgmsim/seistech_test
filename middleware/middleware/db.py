from collections import defaultdict

from middleware import db
import middleware.models as models


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
        db.session.add(models.User(user_id))
        db.session.commit()
        db.session.flush()
    else:
        print(f"User {user_id} already exists")


def _is_project_in_db(project_code):
    """To check whether the given project is in the DB

    Parameters
    ----------
    project_code: string
        A project code we use internally.
        E.g., gnzl, mac_raes, nzgs_pga, soffitel_qtwn...
    """
    return bool(models.Project.query.filter_by(project_code=project_code).first())


def _add_project_to_db(project_code):
    """Add a new project to the MariaDB if not exist

    Parameters
    ----------
    project_code: string
        A project code we use internally.
        E.g., gnzl, mac_raes, nzgs_pga, soffitel_qtwn...
    """
    if not _is_project_in_db(project_code):
        db.session.add(models.Project(project_code))
        db.session.commit()
        db.session.flush()
    else:
        print(f"Project {project_code} already exists")


def _is_permission_in_db(permission_name):
    """To check whether the given permission is in the DB

    Parameters
    ----------
    permission_name: string
        A permission name we use internally.
        E.g., hazard, hazard:hazard, project...
    """
    return bool(
        models.Auth0Permission.query.filter_by(permission_name=permission_name).first()
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
        db.session.add(models.Auth0Permission(permission_name))
        db.session.commit()
        db.session.flush()
    else:
        print(f"Project {permission_name} already exists")


def _is_user_permission_in_db(user_id, permission):
    """Check whether there is a row with given user_id & permission"""
    return bool(
        models.UserPermission.query.filter_by(user_id=user_id)
        .filter_by(permission_name=permission)
        .first()
    )


def _add_user_permission_to_db(user_id, permission):
    """Insert data(page access permission) to the bridging table,
    allowed_permission

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
        db.session.flush()

    if not _is_user_permission_in_db(user_id, permission):
        db.session.add(models.UserPermission(user_id, permission))
        db.session.commit()
        db.session.flush()
    else:
        print(f"{user_id} already has a permission with ${permission}")


def _add_user_project_to_db(user_id, project_code):
    """Insert data(allowed projects) to the bridging table,
    allowed_projects

    Parameters
    ----------
    user_id: string
        Selected user's Auth0 id
    project_code: string
        Selected project's project code.
        E.g., gnzl, mac_raes, nzgs_pga, soffitel_qtwn...
    """

    print(f"Check whether the project is in the DB, if not, add the project to the DB")
    if not _is_project_in_db(project_code):
        print(f"{project_code} is not in the DB so updating it.")
        _add_project_to_db(project_code)
        db.session.flush()

    # Find Find a project object with a given project_code to get its project id
    project_obj = models.Project.query.filter_by(project_code=project_code).first()

    db.session.add(models.UserProject(user_id, project_obj.project_code))
    db.session.commit()
    db.session.flush()


def _remove_user_projects_from_db(user_id, project_code):
    """Remove data(project) from the bridging table,
    allowed_projects

    Parameters
    ----------
    user_id: string
        Selected user's Auth0 id
    project_code: string
        Selected project's project code.
        E.g., gnzl, mac_raes, nzgs_pga, soffitel_qtwn...
    """
    try:
        # Get the project id with the given project name
        certain_project_id = (
            models.Project.query.filter_by(project_code=project_code)
            .first()
            .project_code
        )

        allowed_projects_row = (
            models.UserProject.query.filter_by(user_id=user_id)
            .filter_by(project_code=certain_project_id)
            .first()
        )

        db.session.delete(allowed_projects_row)
        db.session.commit()
        db.session.flush()
    except:
        print("Something went wrong.")


def _remove_user_permission_from_db(user_id, permission):
    """allowed_permission table is outdated, remove illegal permission to update the dashboard"""
    illegal_permission_row = (
        models.UserPermission.query.filter_by(user_id=user_id)
        .filter_by(permission_name=permission)
        .first()
    )

    db.session.delete(illegal_permission_row)
    db.session.commit()
    db.session.flush()


def get_user_projects(user_id):
    """Retrieves all projects ids for the specified user

    Parameters
    ----------
    user_id: string
        user_id from Auth0 to identify the user

    Returns
    -------
    list of Project IDs from DB (Allowed Projects)
    """
    # Get all allowed projects that are allocated to this user.
    allowed_project_objs = (
        models.Project.query.join(models.UserProject)
        .filter((models.UserProject.user_id == user_id))
        .all()
    )

    return [project.project_name for project in allowed_project_objs]


def get_all_users_projects():
    """Retrieve all allowed projects from Allowed_Project table

    Returns
    -------
    allowed_projects_dict: dictionary
        In the form of:
        {
           userA: [ProjectA, ProjectB, ProjectC],
           userB: [ProjectA, ProjectB]
        }
    """
    # Get all allowed projects from the UserDB
    allowed_projects = models.UserProject.query.all()

    allowed_projects_dict = defaultdict(list)

    for project in allowed_projects:
        allowed_projects_dict[project.user_id].append(project.project_code)

    return allowed_projects_dict


def get_all_projects_for_dashboard():
    """Retrieve all the projects we have from Project table

    Then customize the format to send to the frontend for two reasons.
    1. For Table's header(will display the name of the project)
    2. We can use this dictionary to filter the table to tell they have permission

    Returns
    -------
    dictionary:
        In the form of
        {
            project_code: project_full_name
        }
        project_code = (e.g., nzgl, soffitel,qtwn)
        project_fulle_name = user friendly name for project,
        e.g. Generic New Zealand Locations
    """
    # Get all projects from the UserDB.
    all_projects = models.Project.query.all()

    return {project.project_code: project.project_name for project in all_projects}


def allocate_projects_to_user(user_id, project_list):
    """Give user a permission of the chosen projects

    Parameters
    ----------
    user_id: string
        Selected user's Auth0 id
    project_list: array of dictionaries
        List of projects(dictionary) to allocate in the form of
        [{label: readable label, value: project_code}]
    """
    print(f"Check whether the user is in the DB, if not, add the person to the DB")
    if not _is_user_in_db(user_id):
        print(f"{user_id} is not in the DB so updating it.")
        _add_user_to_db(user_id)
        db.session.flush()

    for project in project_list:
        _add_user_project_to_db(user_id, project["value"])


def remove_projects_from_user(user_id, project_list):
    """Remove projects from the chosen user

    Parameters
    ----------
    user_id: string
        Selected user's Auth0 id
    project_list: array
        List of projects to remove from the DB
    """
    for project in project_list:
        _remove_user_projects_from_db(user_id, project["value"])


def _get_user_permissions(requested_user_id):
    """Retrieve all permissions for the specified user

    Returns
    -------
    A list of permission names
    """
    all_allowed_permission_for_a_user_list = models.UserPermission.query.filter_by(
        user_id=requested_user_id
    ).all()

    return [
        permission.permission_name
        for permission in all_allowed_permission_for_a_user_list
    ]


def get_all_users_permissions():
    """Retrieve permissions for all users
    Retrieve all permissions from Users_Permissions table

    Returns
    -------
    Dictionary
        return a list of a dictionary in the form of
            {
              user_id: user_id,
              permission_name: [permission_name]
            }
    """
    # Get all allowed permission from the DB.
    all_allowed_permission_list = models.UserPermission.query.all()

    allowed_permission_dict = defaultdict(list)

    for permission in all_allowed_permission_list:
        allowed_permission_dict[permission.user_id].append(permission.permission_name)

    return allowed_permission_dict


def get_all_permissions_for_dashboard():
    """Retrieve all permissions from Auth0_Permission table

    Returns
    -------
    A list of permission names
    """
    # Get all allowed permission from the DB.
    all_permission_list = models.Auth0Permission.query.all()

    return [permission.permission_name for permission in all_permission_list]


def update_user_permissions(user_id, permission_list):
    """Update/Insert user's allowed permission to a table,
    Users_Permissions
    
    Parameters
    ----------
    user_id: string
        Auth0's unique user id
    permission_list: list
        List of permission that user has. (From Auth0, trusted source)
    """
    # Sync the allowed_permission table to token's permission (trusted source)
    # first before we check/update
    _sync_permissions(user_id, permission_list)

    print(f"Check whether the user is in the DB, if not, add the person to the DB")
    if not _is_user_in_db(user_id):
        print(f"{user_id} is not in the DB so updating it.")
        _add_user_to_db(user_id)
        db.session.flush()

    for permission in permission_list:
        _add_user_permission_to_db(user_id, permission)


def _sync_permissions(user_id, trusted_permission_list):
    """Syncs the user access permissions with the ones from
    the token (the one source of truth)
    Filter the allowed_permission table to remove outdated permission

    If the access token has the permission of A, B, C but allowed_permission table
    has the permission of A, B, C, D. Then remove the permission D from the
    allowed_permission table as the token is the trusted source of permission.

    Parameters
    ----------
    user_id: string
        It will be used to find a list of permission with the function,
        _get_all_allowed_permission_for_a_user(user_id)
    trusted_permission_list: list
        The list to be compared with the list of permission from allowed_permission
        table
    """
    # Get a list of permission that are allocated to this user
    unfiltered_allowed_permission_list = _get_user_permissions(user_id)

    for permission in unfiltered_allowed_permission_list:
        if permission not in trusted_permission_list:
            _remove_user_permission_from_db(user_id, permission)


def write_request_details(user_id, action, query_dict):
    """Record users' interaction into the DB

    Parameters
    ----------
    user_id: string
        Determining the user
    action: string
        What users chose to do
        E.g., Hazard Curve Compute, UHS Compute, Disaggregation Compute...
    query_dict: dictionary
        It is basically a query dictionary that contains attribute and value
        E.g., Attribute -> Station
              value -> CCCC
    """
    # Add to History table
    new_history = models.History(user_id, action)
    db.session.add(new_history)
    db.session.commit()

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
                db.session.add(new_history)
        else:
            new_history = models.HistoryRequest(latest_history_id, attribute, value)
            db.session.add(new_history)

    db.session.commit()
