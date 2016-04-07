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

var students = [{firstName:"Hozaifa", lastName: "Abdalla"}, {firstName: "Kenneth", lastName: "Schnall"}];

var callback = function(student){
    console.log(student);
};

psd.get(students, callback);