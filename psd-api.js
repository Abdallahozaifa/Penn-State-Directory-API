/****************************************
 *     PENN STATE DIRECTORY API         *
 ****************************************/
(function() {

    var express = require('express');
    var app = express();
    var request = require('request');
    var querystring = require('querystring');
    var cheerio = require('cheerio');

    /**
     * psd-api namespace
     *
     */
    var getStudent = function(options) {
        var pub = {};
        var priv = {};
        priv.Student = {},
        priv.form = {};
        /* Search configuration */
        priv.config = {
            year: "" // student year --> undergraduate
        };

        /* Selectors used for searching HTML */
        priv.selectors = {
            matches: "b", // the number of matches for each student
            desc: "th", // the descriptions of the student such as name, email, etc
            data: "td" // the data for the descriptions
        };

        /* Generates new query object for the form */
        priv.newQuery = function(firstName, lastName, userId, email) {
            return {
                'cn': firstName,
                'sn': lastName,
                'uid': userId, // name=uid in search page instead of id=userid
                'mail': email // name=mail in search page instead of id=email
            };
        };

        /* Validation object that contains the different validation methods */
        priv.validate = {
            /* Validates the passed in parameter options */
            options: function(str) {
                return /^[a-zA-Z]+$/.test(str);
            },

            /* Checks if passed in parameter is an email */
            email: function(str) {
                return str.endsWith("@psu.edu");
            },

            /* Checks if passed in parameter contains a number, which means it is an id */
            /* This validation happens AFTER checking if the string is an email */
            userId: function(str) {
                var isNumber, userId = str.match(/\d+/g);
                if (userId != null) {
                    isNumber = true;
                }
                else {
                    isNumber = false;
                }
                return isNumber;
            },

            /* Determines if the option parameter is an object */
            isobjectValid: function() {
                if (typeof options === "object") {
                    /* Checks every value in the options object and Incase the string contains non-alphabet characters */
                    for (var optKey in options) {
                        if ((typeof options[optKey] != "string") || (priv.validate.options(options[optKey]) === false)) {
                            throw new Error("Invalid Object format!");
                        }
                    }
                    return true;
                }
            }
        };

        /* Fills the student info object  */
        priv.fillStudentObj = function(firstName, lastName, userId, email) {
            priv.Student.firstName = firstName;
            priv.Student.lastName = lastName;
            priv.Student.userId = userId;
            priv.Student.email = email;
        };

        /* Initializes the Student object depending on the passed in string */
        priv.initStrStudent = function() {
            /* Checks if passed in parameter is an email */
            if (priv.validate.email(options)) {
                priv.fillStudentObj("", "", "", options);
            }

            /* Checks if passed in parameter is an id */
            else if (priv.validate.userId(options)) {
                priv.fillStudentObj("", "", options, "");
            }

            /* Passed in parameter is not an object, email, or id, so it must be a name */
            else {
                var input = options.split(" ");
                if (input.length === 2) {
                    priv.fillStudentObj(input[0], input[1]);
                }
                else {
                    priv.fillStudentObj(input[0], "", "", "");
                }
            }
        }

        /* Initializes the students information passed in as options */
        priv.initStudent = function() {
            /* Object is valid */
            if (priv.validate.isobjectValid()) {
                Object.assign(priv.Student, options);
            }

            /* Checks if the passed in parameter is a string */
            else if (typeof options === "string") {
                priv.initStrStudent();
            }
        }();

        /* Form object that will contain the form data that will be sent in the post request */
        priv.form.data = priv.newQuery(priv.Student.firstName, priv.Student.lastName, priv.Student.userId, priv.Student.email);
        priv.form.stringFormData = querystring.stringify(priv.form.data); /* Contains the stringified data */
        priv.form.contentLength = priv.form.stringFormData.length; /* Contains the size of the data that is sent over */
        priv.form.dirLink = 'http://www.work.psu.edu/cgi-bin/ldap/ldap_query.cgi';  /* Penn State Directory link for scraping */

        /* Request options that contain the appropriate request headers, url, body, and method for sending the post request */
        priv.form.reqOptions = {
            headers: {
                'Content-Length': priv.form.contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            url: priv.form.dirLink,
            body: priv.form.stringFormData,
            method: 'POST'
        };

        priv.student = {};
        priv.desc = [];
        priv.data = [];

        /* Removes all line breaks in the data retrieved */
        priv.removeLinBr = function(arr) {
            for (var str in arr) {
                arr[str] = arr[str].replace(/\n+/g, '');
            }
        };

        /* Finds if there is a match */
        priv.isStudentFound = function($) {
            if ($(priv.selectors.matches).text().indexOf("0 matches", 0) == 0) {
                return false;
            }
            else {
                return true;
            }
        };
        
        /* Queries the student page for the table headers and table data */
        priv.queryPage = function($) {
            $(priv.selectors.desc).each(function() {
                priv.desc.push($(this).text());
            });

            $(priv.selectors.data).each(function() {
                priv.data.push($(this).text());
            });

            priv.desc.shift();
            priv.removeLinBr(priv.desc);
            priv.removeLinBr(priv.data);
            // console.log(priv.desc);
            console.log(priv.data);
        };
        /* Finds the students info on the given html page */
        priv.findStudent = function(htmlPage) {
            /* Library used to parse html  */
            var $ = cheerio.load(htmlPage);
            
            /* Checks if the student is found */
            if (priv.isStudentFound($)) {
                priv.queryPage($);
            }
            else {
                console.error("Student was not found!");
            }
        };

        /* Scrapes the students html page that is received from the server */
        priv.scrape = function(htmlPage) {
            priv.findStudent(htmlPage);
        };

        /* Callback that executes after the student information is returned */
        var callback = function(err, res, html) {
            if (err) throw new Error('Error in retrieving student informaton');
            priv.scrape(res.body);
        };

        /* Sends the request */
        request(priv.form.reqOptions, callback);
    };

    /* Allows you to pass in array of students for searching */
    var psd = function(input) {
        if (Array.isArray(input)) {
            for (var student in input) {
                console.log(input[student]);
                getStudent(input[student]);
            }
        }
        else {
            getStudent(input);
        }
    };

    /* Starts the psd-api */
    // psd([{
    //     firstName: "Hozaifa",
    //     lastName: "Abdalla"
    // }, {
    //     firstName: "Yehya",
    //     lastName: "Awad"
    // }, {
    //     firstName: "Kenneth",
    //     lastName: "Schnall"
    // }]);

    // psd("Nicholas Cecchetti");

    psd("Hozaifa Abdalla");

    app.listen(process.env.PORT, process.env.IP);
}).call(this);

/* OUTPUT BELOW!

{ firstName: 'Hozaifa', lastName: 'Abdalla' }
{ firstName: 'Yehya', lastName: 'Awad' }
{ firstName: 'Kenneth', lastName: 'Schnall' }
[ 'MANAN VIBHU PATEL',
  'mvp5542@psu.edu',
  'mvp5542@psu.edu',
  '2130 GLENDALE AVEERIE, PA 16510',
  '+1 412 801 1514',
  'UNDERGRAD STUDENT',
  'PENN STATE ERIE, THE BEHREND COLLEGE',
  'COMPUTER SCIENCE',
  'MANAN PATEL',
  'MANAN JIGNESHKUMAR PATEL' ]
[ 'KENNETH ALEXANDER SCHNALL',
  'kas6570@psu.edu',
  'kenneth.schnall@psu.edukensch@psu.edukas6570@psu.edu',
  ' https://kensch.com',
  'UNDERGRAD STUDENT',
  'PENN STATE ERIE, THE BEHREND COLLEGE',
  'ENGINEERING' ]
[ 'YEHYA HOSSAM SAID ABDALLA AWAD',
  'yha5009@psu.edu',
  'HackPSU@psu.eduyehya@psu.eduawad@psu.eduyha5009@psu.edu',
  ' http://www.personal.psu.edu/yha5009',
  '+1 717 460 6012',
  'UNDERGRAD STUDENT',
  'PENN STATE ERIE, THE BEHREND COLLEGE',
  'SOFTWARE ENGINEERING' ]
[ 'HOZAIFA ELHAFIZ ABDALLA',
  'hea113@psu.edu',
  'hea113@psu.edu',
  'UNDERGRAD STUDENT',
  'PENN STATE ERIE, THE BEHREND COLLEGE',
  'SOFTWARE ENGINEERING' ]
[ 'KENNETH ALEXANDER SCHNALL',
  'kas6570@psu.edu',
  'kenneth.schnall@psu.edukensch@psu.edukas6570@psu.edu',
  ' https://kensch.com',
  'UNDERGRAD STUDENT',
  'PENN STATE ERIE, THE BEHREND COLLEGE',
  'ENGINEERING' ]
[ 'KENNETH ALEXANDER SCHNALL',
  'kas6570@psu.edu',
  'kenneth.schnall@psu.edukensch@psu.edukas6570@psu.edu',
  ' https://kensch.com',
  'UNDERGRAD STUDENT',
  'PENN STATE ERIE, THE BEHREND COLLEGE',
  'ENGINEERING' ]

*/