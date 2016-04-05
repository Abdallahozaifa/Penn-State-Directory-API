var psd = require("./psd-api.js");

/* Starts the psd-api below */

/* SAMPLE OBJECT TESTCASES */
/* PASSED */
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
// psd.get({email: "yehya@psu.edu"});
psd.get("Hozaifa");