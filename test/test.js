 /****************************************
 *     Sample Test Cases using Mocha     *
 ****************************************/
var psd = require("../src/psd-api.js");
var assert = require('chai').assert;
var expect = require('chai').expect;

/* Test Suite for Penn State Directory API */
describe('psd',function(){
   
   /* Test Suite for proper creation of API, callback, and instance */ 
   describe('Proper Creation',function(){ 
        it('should create a valid instance', function () {
            assert.equal('object', typeof psd);
        });
        
        it('contains a get function as a property', function () {
            assert.equal('function', typeof psd.get);
        });
        
        it('executes the callback properly', function(done){
            this.timeout(5000);
            var cbRan = false; 
            psd.get("Hozaifa Abdalla", function(student){
                cbRan = true;
                assert.equal(cbRan, true);
                done();
            }); 
        });
   });
   
   /* Test Suite for object inputs */
   describe('.get({...}, callback)', function() {
        it('expected to find Hozaifa Abdalla in object format using first and last name', function(done){
            this.timeout(5000);
            psd.get({firstName: "Hozaifa", lastName:"Abdalla"}, function(student){
                assert.equal(student.Name, "HOZAIFA ELHAFIZ ABDALLA");
                done();
            });
        });
        
        it('expected to find Hozaifa Abdalla the penn state id and email', function(done){
            this.timeout(5000);
            psd.get({userID: "hea113", email: "hea113@psu.edu"}, function(student){
                assert.equal(student.Name, "HOZAIFA ELHAFIZ ABDALLA");
                done();
            });
        });
        
        it('expected to find Kenneth Schnall using penn state id in object format', function(done){
            this.timeout(5000);
            psd.get({userID:"kas6570"}, function(student){
                assert.equal(student.Name, "KENNETH ALEXANDER SCHNALL");
                done();
            });
        });
        
        it('expected to find Kenneth Schnall using penn state email in object format', function(done){
            this.timeout(5000);
            psd.get({email:"kas6570@psu.edu"}, function(student){
                assert.equal(student.Name, "KENNETH ALEXANDER SCHNALL");
                done();
            });
        });
        
        it('expected to find Kenneth Schnall using first name, last name, and penn state email in object format', function(done){
            this.timeout(5000);
            psd.get({firstName:"Kenneth", lastName:"Schnall", email:"kas6570@psu.edu"}, function(student){
                assert.equal(student.Name, "KENNETH ALEXANDER SCHNALL");
                done();
            });
        });
        
        it('expected to find Kenneth Schnall using email and penn state id in object format', function(done){
            this.timeout(5000);
            psd.get({email:"kas6570@psu.edu", userID:"kas6570"}, function(student){
                assert.equal(student.Name, "KENNETH ALEXANDER SCHNALL");
                done();
            });
        });       
   });
   
   /* Test Suite for string inputs */
   describe('.get("...", callback)', function(){
        it('expected result to be null', function(done){
            this.timeout(5000);
            psd.get("XXXXX XXXXX", function(student){
                assert.equal(student, null);
                done();
            });
        });
        
        it('expected to find Kenneth Schnall using penn state id in string format', function(done){
            this.timeout(5000);
            psd.get("kas6570", function(student){
                assert.equal(student.Name, "KENNETH ALEXANDER SCHNALL");
                done();
            });
        });
        
        it('expected to find Kenneth Schnall using penn state email in string format', function(done){
            this.timeout(5000);
            psd.get("kas6570@psu.edu", function(student){
                assert.equal(student.Name, "KENNETH ALEXANDER SCHNALL");
                done();
            });
        });
        
        it('expected to find Hozaifa Abdalla using first and last name in string format', function(done){
            this.timeout(5000);
            psd.get("Hozaifa Abdalla", function(student){
                assert.equal(student.Name, "HOZAIFA ELHAFIZ ABDALLA");
                done();
            });
        });
        
        it('expected to find Hozaifa Abdalla using first and last name in string format', function(done){
            this.timeout(5000);
            psd.get("Hozaifa", function(student){
                assert.equal(student.Name, undefined);
                done();
            });
        });
        
        it('expected to find Hozaifa Abdalla using first and last name in string format', function(done){
            this.timeout(5000);
            psd.get("Hozaifa Abdalla", function(student){
                assert.equal(student.Name, "HOZAIFA ELHAFIZ ABDALLA");
                done();
            });
        });       
   });
   
   /* Test Suite for array inputs */
   describe('.get([...], callback)', function(){
        it('expected to find Hozaifa Abdalla, Kenneth Schnall, and Manan Patel using first and last name in object format in an array', function(done){
            this.timeout(5000);
            var kFound = false, hFound = false, mFound = false;
            var students = [{firstName:"Hozaifa", lastName: "Abdalla"}, {firstName: "Kenneth", lastName: "Schnall"},{firstName: "Manan", lastName: "Patel"}];
            psd.get(students, function(student){
                var ken = "KENNETH ALEXANDER SCHNALL", hozaifa = "HOZAIFA ELHAFIZ ABDALLA", manan = "MANAN JIGNESHKUMAR PATEL";
                switch(student.Name){ 
                    case ken: kFound = true; break;
                    case hozaifa: hFound = true; break;
                    case manan: mFound = true; break;
                }
                
                if(kFound === true && hFound === true && mFound === true){
                    assert.equal(true,true);
                    done();
                }
            });
        });
        
        it('expected to find Hozaifa Abdalla, Kenneth Schnall, and Yehya Awad using penn state ids in object format in an array', function(done){
            this.timeout(5000);
            var kFound = false, hFound = false, yFound = false;
            var students = [{userID: "hea113"}, {userID: "kas6570"},{userID: "yha5009"}];
            psd.get(students, function(student){
                var ken = "KENNETH ALEXANDER SCHNALL", hozaifa = "HOZAIFA ELHAFIZ ABDALLA", yehya = "YEHYA HOSSAM SAID ABDALLA AWAD";
                switch(student.Name){ 
                    case ken: kFound = true; break;
                    case hozaifa: hFound = true; break;
                    case yehya: yFound = true; break;
                }
                
                if(kFound === true && hFound === true && yFound === true){
                    assert.equal(true,true);
                    done();
                }
            });
        });  
   });      
});

