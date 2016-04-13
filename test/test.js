/* Starts the psd-api */
var psd = require("../src/psd-api.js");


/* SAMPLE OBJECT TESTCASES */
// psd.get({lastName: "Abdalla"}); /* PASSED */
// psd.get({email: "hea113"}); /* PASSED */
// psd.get({userID: "hea113"}); /* PASSED */
// psd.get({firstName: "Hozaifa", lastName: ""}); /* PASSED */
// psd.get({firstName: "", lastName: "Abdalla"}); /* PASSED */
// psd.get({firstName: "Hozaifa", lastName: "Abdalla"}); /* PASSED */
// psd.get({firstName: "Hozaifa", lastName: "Abdalla" , userID: "hea113"}); /* PASSED */
// psd.get({firstName: "Hozaifa", lastName: "Abdalla" , userID: ""}); /* PASSED */
// psd.get({firstName: "Hozaifa", lastName: "Abdalla" , userID: "hea113", email: "hea113@psu.edu"}); /* PASSED */
// psd.get({firstName: "Hozaifa", lastName: "Abdalla" , userID: "", email: "hea113@psu.edu"}); /* PASSED */
// psd.get([{firstName: "Hozaifa", lastName:"Abdalla"},{email: "kenneth.schnall@psu.edu"},{userID: "kas6570"}]);
// psd.get("Hozaifa Abdalla");

var assert = require('chai').assert;

// describe('psd', function() {
//     var psd = require("../src/psd-api.js");
//     it('should create a valid instance', function () {
//       assert.equal('object', typeof psd);
//     });
//     it('should have a get property as a function', function () {
//       assert.equal('function', typeof psd.get);
//       console.log("      get()");
//     });
    
//     it('should run the callback', function(){
//        var cbRan = false; 
//        var callback = function(student){
//          cbRan = true;
//          assert.equal(cbRan, true); 
//        };
//        psd.get("Hozaifa Abdalla", callback); 
//     });
    
//     it('should return null when not found', function(){
//         var callback = function(student){
//            assert.equal(student, null);
//         };
//         psd.get("XXXXX XXXXX", callback);
//     });
    
//     it('should find Hozaifa Abdalla', function(){
//        var callback = function(student){
//            assert.equal(student.name, "Hozaifa Abdalla");
//         };
//        psd.get("Hozaifa Abdalla", callback);
//     });
    
//     console.log("get('Kenneth Schnall',..)");
//     it('',function(){
        
//     });
        
// });

var students = [{firstName:"Hozaifa", lastName: "Abdalla"}, {firstName: "Kenneth", lastName: "Schnall"},{firstName: "Manan", lastName: "Patel"}
,{firstName: "Yehya", lastName: "Awad"}];

var callback = function(student){
    console.log(student);
};
// psd.get(students, callback);
psd.get({userID: "hea111"}, callback);
