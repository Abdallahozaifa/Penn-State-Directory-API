/****************************************
 *     PENN STATE DIRECTORY API         *
 ****************************************/
(function(){
    
    var express = require('express');
    var app = express();
    var request = require('request');
    var querystring = require('querystring');
    var cheerio = require('cheerio');
    
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
        /* Penn State Directory link for scraping */
        var dirLink = 'http://www.work.psu.edu/cgi-bin/ldap/ldap_query.cgi';
        
        /* Validates the passed in parameter options */
        priv.validateOptions = function(str){
            return /^[a-zA-Z]+$/.test(str);
        }
        priv.studentInfo = {}
        
        /* Gets the students information passed in as options */
        priv.getStudentInfo = function(){
            /* Determines if the option parameter is an object */
            if(typeof options === "object"){
                /* Checks every value in the options object and Incase the string contains non-alphabet characters */
                for(var optKey in options){
                    if((typeof options[optKey] != "string") || (priv.validateOptions(options[optKey]) === false)){
                        throw new Error("Invalid Object format!");
                    }
                }
                Object.assign(priv.studentInfo,options);
            }
            
            /* Checks if the passed in parameter is a string to initialize the studentInfo object */
            else if(typeof options === "string"){
                var input = options.split(" ");
                if(input.length === 2){
                    priv.studentInfo.firstName = input[0];
                    priv.studentInfo.lastName = input[1];
                }
                else priv.studentInfo.firstName = input[0];
            }
            console.log(priv.studentInfo);
        }();  
        /* Form object that contains the form data that will be sent in the post request */
        var form = {
            data: priv.newQuery(priv.studentInfo.firstName, priv.studentInfo.lastName,"","")
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
        priv.removeLinBr = function(arr){

        };
        /* Callback that executes after the student information is returned */
        var callback = function (err, res, body) {
            if(err){
                throw new Error('Error in retrieving student informaton');
                return;
            }
            /* Library used to parse html  */            
            var $ = cheerio.load(res.body);
                       
            /* Queries the student page for the table headers and table data */           
            $("th").each(function(){
               console.log($(this).text());
               priv.desc.push($(this).text()); 
            });
            
            $("td").each(function(){
               console.log($(this).text());
               priv.data.push($(this).text()); 
            });
            
            priv.desc.shift();
            console.log(priv.desc);
            console.log(priv.data);
            /* Testing purposes only below in order to remove \n characters in each string that is parsed */
            // var someText = "\nhelloman\n";
            // someText.replace(/(\r\n|\n|\r)/gm,"");
            // var cool = [someText];
            // console.log(cool);            
        };
        
        /* Sends the request  */         
        request(priv.reqOptions, callback);
    };
    
    /* Starts the psd-api */
    psd("Hozaifa Abdalla");
    
    app.listen(8080, function () {
        console.log('App listening on port 8080!');
    });
}).call(this);


