# Penn-State-Directory-API
A Penn State Directory scraper that pretends to be the psd-api

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
var psd = require("psd-api");

var callback = function(student) {    
    console.log(student);
};

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

// Search with first and last names
psd.get({firstName: "Hozaifa", lastName: "Abdalla"}, callback);

// Search with userID
psd.get({userID: "hea113"}, callback);

// Search with email
psd.get({email: "hea113@psu.edu"}, callback);

// Search with first name, last name, userID, and email
psd.get({firstName: "Hozaifa", lastName: "Abdalla", userID: "hea113", email: "hea113@psu.edu"}, callback);
```

**psd.get(array, callback)**

```javascript
var students = [{firstName:"Hozaifa", lastName: "Abdalla"}, {firstName: "Kenneth", lastName: "Schnall"}];

// callback that will handle each student 
var callback = function(student){
    console.log(student);
}

// Search an array of students 
psd.get(students, callback);

```
or
```javascript
// Search multiple students using iteration
for(var student in students){
    psd.get(student,callback);
}
```

**psd.get(string, callback)**
```javascript
// Search with first and last names
psd.get("Hozaifa Abdalla", callback);

// Search with userID
psd.get("hea113", callback);

// Search with email
psd.get("hea113@psu.edu", callback);
```

##Example
Checkout this [fiddle]().

Authors
-------
rmp-util was created by Hozaifa Abdalla and Kenneth Schnall

For More Information
--------------------

+ Documentation is available at [Use psd-api](http://usejsdoc.org).
+ Contribute to the docs at [psd-api](https://github.com/Abdallahozaifa/Penn-State-Directory-API).

License
-------

psd-api is copyright (c) 2016 Hozaifa Abdalla, Kenneth Schnall. <br>psd-api is free software, licensed under the MIT License, See the file `LICENSE.md` in this distribution for more details.



