/****************************************
 *     PENN STATE DIRECTORY API         *
 ****************************************/
(function() {

    /* Imports */
    var request = require('request');
    var querystring = require('querystring');
    var cheerio = require('cheerio');

    /* Public object that will contain the public functions that are going to be exported */
    var pub = {};
    /* Private object that  will contain the private functions that will not be exported */
    var priv = {};

    /**
     * psd-api namespace
     *
     */
    var getStudent = function(options, callbackOne) {
        priv.Student = {}, // student 
            priv.form = {}, // form
            priv.desc = [], // description elements from the directory page
            priv.data = []; // data elements from the directory page

        /* Selectors used for searching HTML */
        priv.selectors = {
            MATCHES: "b", // the number of MATCHES for each student
            DESC: "th", // the descriptions of the student such as name, email, etc
            DATA: "td" // the data for the descriptions
        };

        /* Generates new query object for the form */
        priv.newQuery = function(firstName, lastName, userID, email) {
            return {
                'cn': firstName,
                'sn': lastName,
                'uid': userID, // name=uid attribute in search page
                'mail': email // name=mail attribute in search page
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
            userID: function(str) {
                var isNumber, userID = str.match(/\d+/g);
                if (userID != null) {
                    isNumber = true;
                }
                else {
                    isNumber = false;
                }
                return isNumber;
            },

            /* Determines if the option parameter is an object */
            isobjectValid: function() {
                /* Checks every value in the options object and Incase the string contains non-alphabet characters */
                for (var optKey in options) {
                    /* Validates first and last name */
                    if (optKey === "firstName" || optKey === "lastName") {
                        if ((typeof options[optKey] != "string")) {
                            throw new Error("Invalid Object format!");
                        }
                    }

                    /* Validates the user id */
                    else if (optKey === "userID") {
                        if (priv.validate.userID(options["userID"])) return true;
                        else return false;
                    }

                    /* Validates the email */
                    else if (optKey === "email") {
                        if ((priv.validate.email(options[optKey]) === false)) {
                            throw new Error("Invalid Object format!");
                        }
                    }
                    else {
                        throw new Error("Invalid Object format!");
                    }
                }
                return true;
            }
        };

        /* Fills the student info object  */
        priv.fillStudentObj = function(firstName, lastName, userID, email) {
            priv.Student.firstName = firstName;
            priv.Student.lastName = lastName;
            priv.Student.userID = userID;
            priv.Student.email = email;
        };

        /* Initializes the Student object depending on the passed in string */
        priv.initStrStudent = function() {
            /* Checks if passed in parameter is an email */
            if (priv.validate.email(options)) {
                priv.fillStudentObj("", "", "", options);
            }

            /* Checks if passed in parameter is an id */
            else if (priv.validate.userID(options)) {
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
        };

        /* Initializes the student information passed in as options */
        priv.initStudent = function() {
            /* Checks if the passed in is valid object */
            if (typeof options === "object") {
                if (priv.validate.isobjectValid()) {
                    Object.assign(priv.Student, options);
                }
            }

            /* Checks if the passed in parameter is a string */
            else if (typeof options === "string") {
                priv.initStrStudent();
            }
        }();

        /* Form object that will contain the form data that will be sent in the post request */
        priv.form.data = priv.newQuery(priv.Student.firstName, priv.Student.lastName, priv.Student.userID, priv.Student.email);
        priv.form.stringFormData = querystring.stringify(priv.form.data); /* Contains the stringified data */
        priv.form.contentLength = priv.form.stringFormData.length; /* Contains the size of the data that is sent in post request */
        priv.form.dirLink = 'http://www.work.psu.edu/cgi-bin/ldap/ldap_query.cgi'; /* Penn State Directory link for scraping */

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

        /* Removes all line breaks and colons in the data retrieved */
        priv.removeLinBr = function(arr) {
            for (var str in arr) {
                arr[str] = arr[str].trim();
                arr[str] = arr[str].replace(/:/g, '');

                /* Seperates the emails with commas */
                if (priv.validate.email(arr[str])) {
                    arr[str] = arr[str].replace(/\n+/g, ', ');
                }
            }
        };

        /* Finds if there is a match */
        priv.isStudentFound = function($) {
            if ($(priv.selectors.MATCHES).text().indexOf("0 matches", 0) == 0 || options === "") {
                return false;
            }
            else {
                return true;
            }
        };

        /* Formats the data that is received from the html page by removing first entry and line breaks */
        priv.formatData = function() {
            priv.desc.shift();
            priv.removeLinBr(priv.desc);
            priv.removeLinBr(priv.data);
        };

        /* Queries the html page for the students information */
        priv.extractData = function($) {
            priv.data = [], priv.desc = []; // reset
            $(priv.selectors.DESC).each(function() {
                priv.desc.push($(this).text());
            });

            $(priv.selectors.DATA).each(function() {
                priv.data.push($(this).text());
            });

        };

        /* Initializes the Student object with the correct properties and values */
        priv.initStudentData = function() {
            priv.Student = {};
            for (var studKey in priv.data) {
                var studProp = priv.desc[studKey];
                priv.Student[studProp] = priv.data[studKey];
            }
        };

        /* Queries the student page for the table headers and table data */
        priv.getStudentInfo = function($) {
            priv.extractData($);
            priv.formatData();
            priv.initStudentData();
        };

        /* Finds the students info on the given html page */
        priv.findStudent = function(htmlPage) {
            /* Library used to parse html  */
            var $ = cheerio.load(htmlPage);

            /* Checks if the student is found */
            if (priv.isStudentFound($)) {
                priv.getStudentInfo($);
            }
            else {
                if (options != "") console.error("Student was not found!");
                else console.error("Please enter a student!");
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
            callbackOne(priv.Student);
        };

        /* Sends the request */
        request(priv.form.reqOptions, callback);
    };

    /* Allows you to pass in array of students for searching */
    pub.get = function(input, callbackOne) {
        /* Validates if the number of parameter passed in is 2 and the second parameter is a callback */
        if (arguments.length != 2 || typeof callbackOne != "function") {
            console.error("Please provide the correct number of parameters and a callback function!");
            return;
        }

        /* If an array is passed in then loops through and gets each student */
        if (Array.isArray(input)) {
            for (var student in input) {
                getStudent(input[student], callbackOne);
            }
        }
        else {
            getStudent(input, callbackOne);
        }
    };
    /* EXPORTS the psd-api in node */
    module.exports = pub;

}).call(this);
