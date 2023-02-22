# :clapper: JustStreamIt :clapper:

JS vanilla project to fetch data from a python API.

***
## Table of Contents
1. [General Info](#general-info)
2. [Technologies](#technologies)
3. [Installation](#installation)

### :newspaper: General Info :newspaper:
***
This is an OpenClassrooms student front project. The objective is to fetch data from a existing python API and display it like a streaming page.
No framework is used. 

### :briefcase: Technologies :briefcase:
*** 
- JavaScript vanilla
- HTML5 (and JS DOM handling)
- CSS3

Prerequisites: Python

### :wrench: Installation :wrench:
***
In your directory for the project:

Clone repository from : 
- https://github.com/SpiritF0rest/OC_Python_P6_OC_Movies

#### :wrench: Virtual environment creation and use :wrench:

```
In terminal from cloned folder :
$ cd OCMovies-API-EN-FR-master

To create virtual env: 
$ python3 -m venv env

To active the virtual environment:
$ source env/bin/activate

To install dependencies:
$ pip install -r requirements.txt

To create database:
$ python manage.py create_db

To run server:
$ python manage.py runserver

To deactive the virtual environment: 
$ deactivate
```

#### :wrench: Run front part :wrench:

```
With your favorite editor (VSCode), use live server extension en click Go Live
```

#### :mag_right: To check HTML with W3C Validator html :mag_right:

```
First open a movie modal (click on more info button for example) to generate modal DOM.

On devtools console (web browser):
$ copy(new XMLSerializer().serializeToString(document.doctype) + document.getElementsByTagName("html")[0].outerHTML);

Next paste it on W3C validator input and remove fontawesome style tag
We need do that cause of DOM management with JS, I prefer it compared to innerHTML method.
```

***

:snake: Enjoy :snake:
