 /****************************************
 *     PENN STATE DIRECTORY API         *
 ****************************************/
(function() {
    /* Imports */
    var request = require('request');
    var querystring = require('querystring');
    var cheerio = require('cheerio');

    // Polyfill for Object.assign and String.endsWith
    var objectAssign = require('object-assign');
    require('string.prototype.endswith');

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
            priv.directoryPage = {}, // directory page that is returned from the server
            priv.directoryPage.desc = [], // description elements from the directory page
            priv.directoryPage.data = []; // data elements from the directory page


        /* Selectors used for searching HTML */
        priv.selectors = {
            TABLES: "body > div > form > table", // the selector for all the tables on the page for all the students
            MATCHES: "b", // the number of MATCHES for each student
            DESC: "th", // the descriptions of the student such as name, email, etc
            DATA: "td" // the data for the descriptions
        };

        /**
        * Generates new query object for the form.
        * @function
        * @param {string} firstName - The first name of the person.
        * @param {string} lastName - The last name of the person.
        * @param {string} userID - The user id of the person.
        * @param {string} email - The email of the person.
        */
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
                var objKeys = Object.keys(options);

                /* Checks every value in the options object and Incase the string contains non-alphabet characters */
                for(var i=0; i<objKeys.length; i++){

                    /* Validates first and last name and ensures that there is both of them */
                    if(objKeys[0] === 'firstName' && objKeys[1] === 'lastName'){
                        if ((typeof objKeys[0] != "string") && (typeof objKeys[1] != 'string')) {
                            throw new Error("Please provide the correct format for first and last name!");
                        }
                    }

                    /* Validates the user id */
                    else if(objKeys[0] === 'firstName' && objKeys[1] != 'lastName'){
                        throw new Error("Please provide a last name!");
                    }

                    /* Validates the user id */
                    else if (objKeys[i] === "userID") {
                        if (priv.validate.userID(options["userID"])) return true;
                        else return false;
                    }

                    /* Validates the email */
                    else if (objKeys[i] === "email") {
                        if ((priv.validate.email(options['email']) === false)) {
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

        /**
        * Fills the student info object.
        * @function
        * @param {string} firstName - The first name of the person.
        * @param {string} lastName - The last name of the person.
        * @param {string} userID - The user id of the person.
        * @param {string} email - The email of the person.
        */
        priv.fillStudentObj = function(firstName, lastName, userID, email) {
            priv.Student.firstName = firstName;
            priv.Student.lastName = lastName;
            priv.Student.userID = userID;
            priv.Student.email = email;
        };

        /**
        * @function
        * Initializes the Student object depending on the passed in string.
        */
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
                    console.error("Please enter a first and last name!");
                    return;
                }
            }
        };

        /**
        * @function
        * Initializes the student information passed in as options.
        */
        priv.initStudent = function() {
            /* Checks if the passed in is valid object */
            if (typeof options === "object") {
                if (priv.validate.isobjectValid()) {
                    objectAssign(priv.Student, options);
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

        /**
        * Removes all line breaks and colons in the data retrieved.
        * @function
        * @param {array} arr - The array of strings that make up the response from the POST request???.
        */
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

        /**
        * Finds if there is a match.
        * @function
        * @param {$} $ - Cheerio object that is used to query the given html
        */
        priv.isStudentFound = function($) {
            if ($(priv.selectors.MATCHES).text().indexOf("0 matches", 0) == 0 || options === "") {
                return false;
            } else {
                return true;
            }
        };

        /**
        * Formats the data that is received from the HTML page by removing first entry and line breaks.
        * @function
        */
        priv.formatData = function() {
            priv.directoryPage.desc.shift();
            priv.removeLinBr(priv.directoryPage.desc);
            priv.removeLinBr(priv.directoryPage.data);
        };

        /**
        * Queries the HTML page for the students information.
        * @function
        * @param {$} $ - Cheerio object that is used to query the given html
        */
        priv.extractData = function($) {
            priv.directoryPage.data = [], priv.directoryPage.desc = []; // resets the student data and description array
            priv.forms = [];
            var tables = $(priv.selectors.TABLES);
            priv.studs = [];
            tables.each(function(key){
                var table = $(this).text();
                priv.studs.push(table);
                // console.log(table);
            });

            $(priv.selectors.DESC).each(function() {
                priv.directoryPage.desc.push($(this).text());
            });

            $(priv.selectors.DATA).each(function() {
                priv.directoryPage.data.push($(this).text());
            });
        };

        /**
        * Initializes the Student object with the correct properties and values.
        * @function
        */
        priv.initStudentData = function() {
            priv.Student = {};
            for (var studKey in priv.directoryPage.data) {
                var studProp = priv.directoryPage.desc[studKey];
                priv.Student[studProp] = priv.directoryPage.data[studKey];
            }
        };

        /**
        * Queries the student page for the table headers and table data.
        * @function
        * @param {$} $ - Cheerio object that is used to query the given html
        */
        priv.getStudentInfo = function($) {
            priv.extractData($);
            priv.formatData();
            priv.initStudentData();
        };

        /**
        * Finds the students info on the given HTML page.
        * @function
        * @param {string} htmlPage - String representing the HTML recieved from the POST request???.
        */
        priv.findStudent = function(htmlPage) {
            /* Library used to parse HTML  */
            var $ = cheerio.load(htmlPage);

            /* Checks if the student is found */
            if (priv.isStudentFound($)) {
                priv.getStudentInfo($);
            }
            else {
                if (options != "") priv.Student = null;
                else console.error("Please enter a student!");
            }
        };

        /**
        * Scrapes the students HTML page that is received from the server.
        * @function
        * @param {string} htmlPage - String representing the HTML recieved from the POST request???.
        */
        priv.scrape = function(htmlPage) {
            priv.findStudent(htmlPage);
        };

        /**
        * Callback that executes after the student information is returned.
        * @function
        * @param {boolean} err - Whether or not an error ocurred.
        * @param {string} res - The respone object.
        * @param {object} html - the body of the request.
        */
        var callback = function(err, res, html) {
            if (err) throw new Error('Error in retrieving student informaton');
            priv.scrape(res.body);
            callbackOne(priv.Student);
        };

        /* Sends the request */
        request(priv.form.reqOptions, callback);
    };

    /**
    * Allows you to pass in array of students for searching.
    * @function
    * @param {String or Object} input - input that is queried in the penn state directory.
    * @param {function} callbackOne - First callback function.
    */
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
