/****************************************
 *     PENN STATE DIRECTORY API         *
 ****************************************/
(function(){
    
    var express = require('express');
    var app = express();
    var request = require('request');
    var querystring = require('querystring');
    var cheerio = require('cheerio');
    
    // var $ = require('jquery');
    
  /**
   * psd-api namespace
   *
   */
    var psd = function(options){ 
        var pub = {};
        var priv = {};
        /* Search configuration */
        priv.config = {
            year: "" // student year --> undergraduate
        };
        
        /* Selectors used for searching HTML */
        priv.selectors = {
            
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
        
        var dirLink = 'http://www.work.psu.edu/cgi-bin/ldap/ldap_query.cgi';
        
        priv.validateOptions = function(str){
            return /^[a-zA-Z]+$/.test(str);
        }
        priv.studentInfo = {}
        priv.optValid = true;
        
        /* Gets the students information passed in as options */
        priv.getStudentInfo = function(){
            if(typeof options === "object"){
                for(var optKey in options){
                    if((typeof options[optKey] != "string") || (priv.validateOptions(options[optKey]) === false)){
                        console.error("Invalid Object format!");
                        priv.optValid = false;
                    }
                }
                priv.optValid === true ? Object.assign(priv.studentInfo,options) : null;
            }else if(typeof options === "string"){
                var input = options.split(" ");
                if(input.length === 2){
                    priv.studentInfo.firstName = input[0];
                    priv.studentInfo.lastName = input[1];
                }
                else priv.studentInfo.firstName = input[0];
            }
        }();  
        /* form object that contains the form data that will be sent in the post request */
        var form = {
            data: priv.newQuery(priv.studentInfo.firstName, priv.studentInfo.lastName,"","")
        };       
        var stringFormData = querystring.stringify(form.data);
        var contentLength = stringFormData.length;
        
        /* request options that contain the appropriate request headers, url, body, and method for sending the post request */
        priv.reqOptions = {
           headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            url: dirLink,
            body: stringFormData,
            method: 'POST'
        };
        
        priv.student = {
          name: '',
          email: '',
          title: '',
          campus: '',
          major: ''
            
        };
        
        /* callback that executes after the student information is returned */
        var callback = function (err, res, body) {
            if(err){
                throw new Error('Error in retrieving student informaton');
                return;
            }
            
            var $ = cheerio.load(res.body);            
            /* Queries the student page for the body */
            $("body").filter(function(){
                // console.log($(this).text());
            });
            
        };
        
        /* Sends the request  */         
        request(priv.reqOptions, callback);
    };
    
    psd("Hozaifa");
    
    app.listen(8080, function () {
        console.log('App listening on port 8080!');
    });
}).call(this);


