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
    var getStudentInfo = function(options) {
        var pub = {};
        var priv = {};
        /* Search configuration */
        priv.config = {
            year: "" // student year --> undergraduate
        };

        /* Selectors used for searching HTML */
        priv.selectors = {
            matches: "b", // the number of matches for each student
            desc: "th", // the descriptions of the student such as name,email,..etc
            data: "td" // the data for the descriptions
        };

        /* Generates new query object for the form */
        priv.newQuery = function(firstName, lastName, userId, email) {
            return {
                'cn': firstName,
                'sn': lastName,
                'userid': userId,
                'email': email
            };
        };
        /* Penn State Directory link for scraping */
        var dirLink = 'http://www.work.psu.edu/cgi-bin/ldap/ldap_query.cgi';

        /* Validates the passed in parameter options */
        priv.validateOptions = function(str) {
            return /^[a-zA-Z]+$/.test(str);
        };

        priv.studentInfo = {};
        /* Initializes the students information passed in as options */
        priv.initStudentInfo = function() {
            /* Determines if the option parameter is an object */
            if (typeof options === "object") {
                /* Checks every value in the options object and Incase the string contains non-alphabet characters */
                for (var optKey in options) {
                    if ((typeof options[optKey] != "string") || (priv.validateOptions(options[optKey]) === false)) {
                        throw new Error("Invalid Object format!");
                    }
                }
                Object.assign(priv.studentInfo, options);
            }

            /* Checks if the passed in parameter is a string to initialize the studentInfo object */
            else if (typeof options === "string") {
                var input = options.split(" ");
                if (input.length === 2) {
                    priv.studentInfo.firstName = input[0];
                    priv.studentInfo.lastName = input[1];
                }
                else priv.studentInfo.firstName = input[0];
            }
        }();
        /* Form object that contains the form data that will be sent in the post request */
        var form = {
            data: priv.newQuery(priv.studentInfo.firstName, priv.studentInfo.lastName, "", "")
        };
        var stringFormData = querystring.stringify(form.data);
        var contentLength = stringFormData.length;

        /* Request options that contain the appropriate request headers, url, body, and method for sending the post request */
        priv.reqOptions = {
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            url: dirLink,
            body: stringFormData,
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
        /* Callback that executes after the student information is returned */
        var callback = function(err, res, html) {
            if (err) {
                throw new Error('Error in retrieving student informaton');
            }


            /* Library used to parse html  */
            var $ = cheerio.load(res.body);

            /* Finds if there is a match */
            if ($(priv.selectors.matches).text().indexOf("0 matches", 0) == 0) {
                console.error("Student was not found!");
            }
            else {
                /* Queries the student page for the table headers and table data */
                $(priv.selectors.desc).each(function() {
                    priv.desc.push($(this).text());
                });

                $(priv.selectors.data).each(function() {
                    priv.data.push($(this).text());
                });
                // console.log(html);
                priv.desc.shift();
                priv.removeLinBr(priv.desc);
                priv.removeLinBr(priv.data);
                // console.log(priv.desc);
                console.log(priv.data);
            }

        };

        /* Sends the request  */
        request(priv.reqOptions, callback);
    };

    /* Allows you to pass in array of students for searching */
    var psd = function(input) {
        if (Array.isArray(input)) {
            for (var student in input) {
                console.log(input[student]);
                getStudentInfo(input[student]);
            };
        }
        else {
            getStudentInfo(input);
        }
    };
    /* Starts the psd-api */
    psd([{
        firstName: "Hozaifa",
        lastName: "Abdalla"
    }, {
        firstName: "Yehya",
        lastName: "Awad"
    }, {
        firstName: "Kenneth",
        lastName: "Schnall"
    }]);

    psd("Nicholas Cecchetti");

    app.listen(process.env.PORT, process.env.IP);
}).call(this);

/* OUTPUT BELOW!
{ firstName: 'Hozaifa', lastName: 'Abdalla' }
{ firstName: 'Yehya', lastName: 'Awad' }
{ firstName: 'Kenneth', lastName: 'Schnall' }
[ 'YEHYA HOSSAM SAID ABDALLA AWAD',
  'yha5009@psu.edu',
  'HackPSU@psu.eduyehya@psu.eduawad@psu.eduyha5009@psu.edu',
  ' http://www.personal.psu.edu/yha5009',
  '+1 717 460 6012',
  'UNDERGRAD STUDENT',
  'PENN STATE ERIE, THE BEHREND COLLEGE',
  'SOFTWARE ENGINEERING' ]
[ 'KENNETH ALEXANDER SCHNALL',
  'kas6570@psu.edu',
  'kas6570@psu.edu',
  'UNDERGRAD STUDENT',
  'PENN STATE ERIE, THE BEHREND COLLEGE',
  'ENGINEERING' ]
[ 'HOZAIFA ELHAFIZ ABDALLA',
  'hea113@psu.edu',
  'hea113@psu.edu',
  'UNDERGRAD STUDENT',
  'PENN STATE ERIE, THE BEHREND COLLEGE',
  'SOFTWARE ENGINEERING' ]
*/
