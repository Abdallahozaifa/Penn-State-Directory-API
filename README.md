[![npm version](https://badge.fury.io/js/psd-api.svg)](https://badge.fury.io/js/psd-api)
[![Build Status](https://travis-ci.org/Abdallahozaifa/Penn-State-Directory-API.svg?branch=master)](https://travis-ci.org/Abdallahozaifa/Penn-State-Directory-API)
# Penn-State-Directory-API
The Penn State Directory API.

##Installation

Node.js
```
$ npm install psd-api --save
```

To install the latest development version:
```
npm install git+https://github.com/Abdallahozaifa/Penn-State-Directory-API
```

##Usage

###Node.js

```javascript
/* Creating an instance of the psd scraper */
var psd = require("psd-api");

/* Callback that will execute once the students information is received */
var callback = function(student) {    
    console.log(student);
};

/* Obtaining the students information */
psd.get("Hozaifa Abdalla", callback);
```

Output:
```
{ 
  Name: 'HOZAIFA ELHAFIZ ABDALLA',
  'E-mail': 'hea113@psu.edu',
  'Mail ID': 'hea113@psu.edu',
  Title: 'UNDERGRAD STUDENT',
  Campus: 'PENN STATE ERIE, THE BEHREND COLLEGE',
  Curriculum: 'SOFTWARE ENGINEERING' 
}

```
### API

Obtaining students

**psd.get(object, callback)**
```javascript
var psd = require("psd-api");

/* Search with first and last names */
psd.get({firstName: "Hozaifa", lastName: "Abdalla"}, callback);

/* Search with userID */
psd.get({userID: "hea113"}, callback);

/* Search with email */
psd.get({email: "hea113@psu.edu"}, callback);

/* Search with first name, last name, userID, and email */
psd.get({firstName: "Hozaifa", lastName: "Abdalla", userID: "hea113", email: "hea113@psu.edu"}, callback);
```

**psd.get(array, callback)**

```javascript
/* Defining an array of students to be searched */
var students = [{firstName:"Hozaifa", lastName: "Abdalla"}, {firstName: "Kenneth", lastName: "Schnall"}];

/* callback that will handle each student */
var callback = function(student){
    console.log(student);
}

/* Search an array of students */
psd.get(students, callback);

```
or
```javascript
/* Search multiple students using iteration */
for(var student in students){
    psd.get(student,callback);
}
```

**psd.get(string, callback)**
```javascript
/* Search with first and last names */
psd.get("Hozaifa Abdalla", callback);

/* Search with userID */
psd.get("hea113", callback);

/* Search with email */
psd.get("hea113@psu.edu", callback);
```

Authors
-------
psd-api was created by Hozaifa Abdalla and Kenneth Schnall.

License
-------

psd-api is copyright (c) 2016 Hozaifa Abdalla, Kenneth Schnall. <br>psd-api is free software, licensed under the MIT License, See the file `LICENSE.md` in this distribution for more details.



