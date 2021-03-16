## March 16, 2021

### Update to use API servers on the Mantle - ([PR #55](https://github.com/ucgmsim/seistech_psha_frontend/pull/55)

- Modify the frontend + Middleware server to accept updated parameters name from the Mantle.
  - Planning to transfer servers from rcc to the Mantle to host API servers.
    - Project API
    - Core API

## March 15, 2021

### Fix the GMS plot issue - ([PR #54](https://github.com/ucgmsim/seistech_psha_frontend/pull/54)

- Fix the GMS plot - instead of using the user's IM/Exceedance rate level, use the IM_j value from the API.
- Remove the `Highlight.js` package as no longer needed.
  - It used to be used on the `Profile` page. However, this was a default thing from Auth0 and we will have our version of the `Profile` page later.
- Implement the computed GMS data validation
  - Check the IM Type matches with selected Conditioning IM Name
  - Checking its properties
    - To see if any of the properties with 0 lengths (It means no values for this property)
    - To see if some of the properties' properties are matching with the selected IM Vectors
      (For instance, if selected IM Vectors are PGA, pSA_0.01 and pSA_0.02, then properties of `gcim_cdf_x`, `gcim_cdf_y` and `realisations` should match with the selected IM Vectors))
- With the validation above, if something goes wrong, we set the `setShowErrorMessage` to show an error message.
  - Currently, this is more developers-friendly

## March 12, 2021

### Update the logic on Middleware(Mainly the IntermediateAPI & DB) - ([PR #53](https://github.com/ucgmsim/seistech_psha_frontend/pull/53)

- Make Intermediate API's endpoints as simple as possible.
- Transfer some logic from the backend to the frontend.

## March 11, 2021

### Replace the frontend's NZCode to NZS1170p5 - ([PR #52](https://github.com/ucgmsim/seistech_psha_frontend/pull/52)

- As we decided to use the term `NZS1170p5`, update old NZCode variables to NZS1170p5.

## March 10, 2021

### Refactor the IntermediateAPI & Frontend - ([PR #51](https://github.com/ucgmsim/seistech_psha_frontend/pull/51)

- Update the Project table to have the following attributes:
  1. project_id - E.g., gnzl, mac_raes, nzgs_pga...
  2. project_name - Generic New Zealand Locations, MacRaes Oceania Gold...
  3. access_level - At the moment, only public or private
- Refactor the IntermediateAPI & Frontend due to restructuring the DB

## March 9, 2021

### Restructure the Middleware - ([PR #50](https://github.com/ucgmsim/seistech_psha_frontend/pull/50)

- Remove `server.py`
- Make more use of `__init__.py`
- Remove `__init__.py` from `/middleware/api/` directory

## March 3, 2021

### Restructure the Intermediate API - ([PR #49](https://github.com/ucgmsim/seistech_psha_frontend/pull/49)

- Restructure the Intermediate API.
  - Change the way we import packages like the SeisTech package does(CoreAPI/ProjectAPI) to keep the conventions.
  - Rename a few functions name to make them simple but meaningful.
  - Also, updated a few docstrings to make them simple but meaningful, also added Parameters and Returns information.
  - Updated a few tables names to avoid any confusion
    - `Auth0_Permission` is the table that contains permission information from Auth0.
    - `Users_Permissions` is the bridging table between `User` and `Auth0_Permission`.
    - `Users_Projects` is the bridging table between `User` and `Project`. (It used to be called, `Available_Projects` but saying `Available_Projects` was not 100% clear. So even it's not the best practice of naming the bridging table with connected tables but I thought this was the best we could find for now.)
  - Some of the endpoint's path is also changed.

## February 26, 2021

### Implement dashboards for Project Permission and Page Permission - ([PR #49](https://github.com/ucgmsim/seistech_psha_frontend/pull/49)

- Now we have a permission config page with permission dashboards to check users' permission.
- Hence, updated the User DB structure.

## February 22, 2021

### Fix Middleware's bug - Circular import - ([PR #48](https://github.com/ucgmsim/seistech_psha_frontend/pull/48)

- Change the structure a little bit to fix the circular import.

## February 18, 2021

### GMS Feedback Update Part 1 - ([PR #45](https://github.com/ucgmsim/seistech_psha_frontend/pull/45))

- A few updates for the Frontend based on the feedback we got from a quick meeting. These are mainly for the Frontend, more to come once the API is updated.
- Install a package called `DOMPurify` to sanitize HTML to be used for `dangerouslySetInnerHTML` prop.

## February 17, 2021

### Adding Framework Documentation page - ([PR #47](https://github.com/ucgmsim/seistech_psha_frontend/pull/47)

- Framework Documentation page to give the user more information if they want to know more.

## February 16, 2021

### Adding Latitude and Longitude to the Metadata box - ([PR #46](https://github.com/ucgmsim/seistech_psha_frontend/pull/46)

- Metadata now includes the Latitude and Longitude information for Hazard Curves in the Project tab.
- Disabled the record activities to the DB feature for now due to circular import.

## February 11, 2021

### Allocate projects to users - ([PR #44](https://github.com/ucgmsim/seistech_psha_frontend/pull/44))

- We now have a simple UI to allocate addable projects to a certain user under Edit User section.
- Refactored Middleware's structure.

## February 10, 2021

### HOTFIX - ([PR #43](https://github.com/ucgmsim/seistech_psha_frontend/pull/43))

- `useEffect` hook only works when an object is not empty due to using `replaceAll` function.

## February 9, 2021

### GMS Viewer - ([PR #42](https://github.com/ucgmsim/seistech_psha_frontend/pull/42))

- Implement the GMS section for Hazard Analysis.

## February 3, 2021

### Tooltips - ([PR #40](https://github.com/ucgmsim/seistech_psha_frontend/pull/40))

- Tooltips with a brief explanation.
- Disable the MapBox in Hazard Analysis temporarily due to the crash.

## January 27, 2021

### Filter UHS section based on given IM list - ([PR #38](https://github.com/ucgmsim/seistech_psha_frontend/pull/38))

- If IM does not have one starts with `pSA`, the UHS section will be disabled.

### Fix EA Site Selection 0.000 issue - ([PR #39](https://github.com/ucgmsim/seistech_psha_frontend/pull/39))

- Fixed an input fields issue, displaying 0.000 instead of a hint even with no default values.

## January 22, 2021

### HOTFIX - Flask-SQLAlchemy isolation level config - ([PR #37](https://github.com/ucgmsim/seistech_psha_frontend/pull/37))

- Isolation level was REPEATABLE-READ which can only access/read data that are there in DB before the server starts.

## January 21, 2021

### Cross-check Project IDs and Adopt the Project API's change - ([PR #36](https://github.com/ucgmsim/seistech_psha_frontend/pull/36))

- For Project IDs in the Project tab, it is now doing cross-check in User DB's Available_Project table and Project API.
- Instead of just a project id, API now sends more readable information for a user. E.g., Users now see Generic New Zealand Locations instead of gnzl.

## January 20, 2021

### HOTFIX - Unsorted Hazard's IM list - ([PR #35](https://github.com/ucgmsim/seistech_psha_frontend/pull/35))

- Fix the unsorted Hazard's IM list. It follows a certain pattern to sort IMs.

## January 19, 2021

### Fix the Project's UHS plots and update Project/Hazard's UHS plotly.js label - ([PR #34](https://github.com/ucgmsim/seistech_psha_frontend/pull/34))

- Fix the plots so now Project's UHS only plot with selected RPs instead of every possible rate.
- Label now contains both RP and Rate information.

## January 18, 2021

### Fix the Download URL & Disable GMS Tab - ([PR #32](https://github.com/ucgmsim/seistech_psha_frontend/pull/32))

- Now the URL does not include extra unnecessary character in the end.
- Disabled the GMS tab for now as it does not contain anything but saying "GMS is coming!"

## January 15, 2021

### EC2 Docker setup - ([PR #30](https://github.com/ucgmsim/seistech_psha_frontend/pull/30))

- Modify the docker-compose to adopt all three parts, DB, Middleware and Frontend.

### Not plotting if it contains NaN - ([PR #31](https://github.com/ucgmsim/seistech_psha_frontend/pull/31))

- If the data object contains `NaN` value, we do not plot them.

## January 13, 2021

### Plotly.js feedback & Minor bug fix - ([PR #28](https://github.com/ucgmsim/seistech_psha_frontend/pull/28))

- Remove unnecessary plotly.js options to avoid users confusion.
- Minor bug fix
  - Using UHS's RPs for Project's UHS instead of Disagg's RPs
  - If the Project API returns an empty RP lits for UHS, disable the dropdown and say not available.

### MariaDB implementation - ([PR #29](https://github.com/ucgmsim/seistech_psha_frontend/pull/29))

- We now have a DB for User and Project which could make us eas to pull/retrieve users available projects for the Project tab later one.

## January 12, 2021

### Update the Navbar's visibility - ([PR #27](https://github.com/ucgmsim/seistech_psha_frontend/pull/27))

- The app will check the user's authentication status and their permissions to decide to display the navbar with **Hazard Analysis** and/or **Project** or no tabs but logout button.

## December 22, 2020

### Update the deprectaed pakcage - ([PR #26](https://github.com/ucgmsim/seistech_psha_frontend/pull/26))

- Security issue with 9.x version so updated to 10.0, we may not keep this package, `highlight.js` but in case we keep it.

## December 14, 2020

### HOTFIX - SeisTech subdirectory name for private_requirements.txt - ([PR #20](https://github.com/ucgmsim/seistech_psha_frontend/pull/20))

- SeisTech now has a subdirectory called `core_api` instead of `seistech_api` so updating it in private_requirements.txt.

### Project Download - We can also download our computed data in zip format - ([PR #19](https://github.com/ucgmsim/seistech_psha_frontend/pull/19))

## December 11, 2020

### Support NZS 1170 - ([PR #14](https://github.com/ucgmsim/seistech_psha_frontend/pull/14))

- Now we have a dedicated `NZCode` section to control/update the NZ Code plots
- Hazard Curve and UHS now also have a tick box to control the NZ Code plot's visibility (Default is true, visible)

## December 9, 2020

### SiteSelection location inputs format - ([PR #15](https://github.com/ucgmsim/seistech_psha_frontend/pull/15))

- When Lat and Lng are coming from the MapBox, we display up to 4 decimals but we send actual coordinates to Core API when it is being used. (14dp)
- When Lat and Lng are coming from the users with input fields, we do not limit the decimal points. They can make it as accurate as possible.

## November 30, 2020

### Added the Project Tab - ([PR #13](https://github.com/ucgmsim/seistech_psha_frontend/pull/13))

- Now we have a project tab next to the `Hazard Analysis` button.

## November 27, 2020

### Customize the `plotly.js` images filename - ([PR #12](https://github.com/ucgmsim/seistech_psha_frontend/pull/12))

- We can customize the filenames to what we want instead of using the default format, `image.png`.

## November 16, 2020

### Replace fetch API to axios - ([PR #9](https://github.com/ucgmsim/seistech_psha_frontend/pull/9))

- Instead of using fetch API, using axios to adopt `blob` data format.

### Rename the directory name in `travis.yml` - ([PR #11](https://github.com/ucgmsim/seistech_psha_frontend/pull/11))

- Because we are now in a different work repository. (`seistech` -> `seistech_psha_frontend`)

## Octoboer 23, 2020

### Handle different errors & fix Abortable fetch error - Frontend ([PR #7](https://github.com/ucgmsim/seistech_psha_frontend/pull/7))

- Now handling two different error codes, 400 and 500. (Will be added more)
- When an abortable error occurs, it only shows a warning message instead of having both a warning message and newer result.

## October 22, 2020

### Fix Docker ([PR #6](https://github.com/ucgmsim/seistech_psha_frontend/pull/6))

- Switched the repo from Private to Public, need to update a few things on `docker-compose.yml` and `Dockerise.sh`.

## October 15, 2020

### HOTFIX - Frontend ([PR #5](https://github.com/ucgmsim/seistech_psha_frontend/pull/5))

- Update the URL.

## October 14, 2020

### Add Instructions - ([PR #320](https://github.com/ucgmsim/seistech/pull/320))

- Update the ReadME.

## October 13, 2020

### GMS API Call - ([PR #318](https://github.com/ucgmsim/seistech/pull/318))

- Implement API calls for GMS.

### Replace all sensitive variables to ENV - ([PR #319](https://github.com/ucgmsim/seistech/pull/319))

- We now use ENV for sensitive variables.

## October 9, 2020

### Fix ENV issue with Docker on EC2 - ([PR #317](https://github.com/ucgmsim/seistech/pull/317))

- Update the bash file to create he build date and SW version. (git latest commit's hash)

## October 7, 2020

### Fix the Duplicate Requests - ([PR #315](https://github.com/ucgmsim/seistech/pull/315))

- We now only send a request once.

## October 6, 2020

### Button's Location - ([PR #313](https://github.com/ucgmsim/seistech/pull/313))

- Button location is now the same regardless of the screen's resolution.
- Input's placeholder
  - [] for the inclusive range
  - () for the exclusive range

## October 5, 2020

### Tidy Up for EA - ([PR #312](https://github.com/ucgmsim/seistech/pull/312))

- Removed a few unnecessary packages
- Footer with SW Version & Build Date
- Extra error handling
- Fixed conditional statements

## October 1, 2020

### Hazard Metadata - ([PR #309](https://github.com/ucgmsim/seistech/pull/309))

- **Hazard Curve** now has the metadata section underneath the plot.
- ModeBar for `plotly.js` is now always visible.
- Font size is now more responsive based on the resolution.

### Input Validation - ([PR #310](https://github.com/ucgmsim/seistech/pull/310))

- We can now validate the users' input.

## September 29, 2020

### Handling Failed HTTP Responses with fetch API - ([PR #307](https://github.com/ucgmsim/seistech/pull/307))

- By adding an error handler, we can prevent the app crashes.

## September 18, 2020

### GMS Layout - ([PR #301](https://github.com/ucgmsim/seistech/pull/301))

- Scaffolded the GMS's layout.

## September 16, 2020

### EA Setup - ([PR #298](https://github.com/ucgmsim/seistech/pull/298))

- There is a `docker-compose.yml` to create two docker images. (Frontend and Intermediate API)

### Fix Plots & Adopt Feedback - ([PR #300](https://github.com/ucgmsim/seistech/pull/300))

- Set the range on the y-axis to be displayed only between a certain range.
- No placeholders in input fields
- EA doesn't allow to choose ensemble, it is fixed to `v20p5emp`.
- Disable the Mouse Wheel Scroll on input fields.

## September 13, 2020

### Update for EA - ([PR #295](https://github.com/ucgmsim/seistech/pull/295))

- EA version does not have any default values.
- Update the logic on **Disaggregation**.
- Change the container's height. (Layout)
- Make some constant variables.

## September 9, 2020

### Adopt the feedback - ([PR #292](https://github.com/ucgmsim/seistech/pull/292))

- Contribution table's column, update `Annual recurrence probability` to `Annual recurrence rate`.
- `Annual recurrence rate` is now displaying number as `Exponential Notation`
- The contribution is displaying number as a percentage with 4dp.
- Only keeping `Annual exceedance rate` in **UHS** and **Disaggregation**
- Layouts are now more flexible in different resolutions.

## September 8, 2020

### Fix the spinner bug and update vs30 input field - ([PR #291](https://github.com/ucgmsim/seistech/pull/291))

- Fixed the known issue on Location's set button with loading spinner.
- Update the logic on VS30 input.

## September 4, 2020

### Update some logics and Tidy up - ([PR #289](https://github.com/ucgmsim/seistech/pull/289))

- Logic on Compute and Set buttons
- Set button inside the Site Selection, now showing loading spinner when it's loading.

## September 3, 2020

### Fix the memory leak - ([PR #287](https://github.com/ucgmsim/seistech/pull/287))

- Memory leak issue is fixed by using a cleanup function.
- Update the UHS's logic.

## September 2, 2020

### Tidy up the Frontend & Restructure the project - ([PR #284](https://github.com/ucgmsim/seistech/pull/284))

- Split one Hazard Form file into three different components.
- Update the project's structure to be more flexible.

## August 31, 2020

### EA Part Six - ([PR #283](https://github.com/ucgmsim/seistech/pull/283))

- Fix the logic behind **Seismic Hazard**.
- Compute button's availability.
- **Show more** button is not sitting next to the **Download Data** button.

## August 28, 2020

### EA Part Five - ([PR #282](https://github.com/ucgmsim/seistech/pull/282))

- Create a Download Data button as a component to be reusable.
- Update the logic behind VS30.

## August 27, 2020

### EA Part Four - ([PR #280](https://github.com/ucgmsim/seistech/pull/280))

- Adding a guide message when there are no plots. (Not computed yet)
- Instead of saying `Plot will be displayed...`, there is a loading spinner.

### Dockerise - ([PR #281](https://github.com/ucgmsim/seistech/pull/281))

- Now the Frontend and Intermediate API can be run on anywhere with Docker.

## August 26, 2020

### EA Part Two - ([PR #278](https://github.com/ucgmsim/seistech/pull/278))

- Update the Download data based on the feedback.
- Some refactoring done.

### EA Part Three - ([PR #279](https://github.com/ucgmsim/seistech/pull/279))

- Updating Ensemble options, now the default chosen ensemble is `v20p5emp`. But this dropdown is only visible within DEV.
- Adding NZ Code plot in the **Branch Plot**.

## August 25, 2020

### EA Part One - ([PR #276](https://github.com/ucgmsim/seistech/pull/276))

- There are two different versions, DEV and EA.
- DEV will be the one with newer functions but may not be stable.
- EA will be the one to use to get feedback.
- DEV has some default values but EA does not.
- Bring back the two columns view.

## August 24, 2020

### Change MapBox durations (time taken between two points) to be dynamic - ([PR #274](https://github.com/ucgmsim/seistech/pull/274))

- Based on the distance between the current and the old pin, the speed is different.

## August 21, 2020

### Tidy up on Docker - ([PR #272](https://github.com/ucgmsim/seistech/pull/272))

- Tidy up on dockerizing the Frontend & Intermediate API.

### Update endpoints path - ([PR #275](https://github.com/ucgmsim/seistech/pull/275))

- Update endpoints path to the Frontend and Intermediate API.

## August 6, 2020

### Fix UHS and Disaggregation - Frontend ([PR #269](https://github.com/ucgmsim/seistech/pull/269))

- Now the calculation works properly with given variables, Probability, Years, Return Period and Annual Probability.
- Getting a station from **Site Selection**.
- UHS no longer needs **Hazard Curve** to be done first.

## August 5, 2020

### Download Data - Frontend ([PR #266](https://github.com/ucgmsim/seistech/pull/266))

- Now there is a dedicated button to download data for **Hazard Curve** and **Disaggregation**.

## August 4, 2020

### Adding MapBox - Frontend ([PR #265](https://github.com/ucgmsim/seistech/pull/265))

- Now there is an interactive map which users can use to set the coordinates with a pin.
