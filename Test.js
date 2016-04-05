var psd = require("./psd-api.js");

/* Starts the psd-api below */

/* SAMPLE OBJECT TESTCASES */
/* PASSED */
// psd({lastName: "Abdalla"}); /* PASSED */
// psd({email: "hea113"}); /* PASSED */
// psd({userID: "hea113"}); /* PASSED */
// psd({firstName: "Hozaifa", lastName: ""}); /* PASSED */
// psd({firstName: "", lastName: "Abdalla"}); /* PASSED */
// psd({firstName: "Hozaifa", lastName: "Abdalla"}); /* PASSED */
// psd({firstName: "Hozaifa", lastName: "Abdalla" , userID: "hea113"}); /* PASSED */
// psd({firstName: "Hozaifa", lastName: "Abdalla" , userID: ""}); /* PASSED */
// psd({firstName: "Hozaifa", lastName: "Abdalla" , userID: "hea113", email: "hea113@psu.edu"}); /* PASSED */
// psd({firstName: "Hozaifa", lastName: "Abdalla" , userID: "", email: "hea113@psu.edu"}); /* PASSED */
// psd({
//     email: "yehya@psu.edu"
// });

psd.get("Hozaifa");