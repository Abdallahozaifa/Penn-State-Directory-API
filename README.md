# Penn-State-Directory-API
API that obtains student information from the Penn State Directory.

### Things to be done
* Remove '\n' characters from the priv.data and priv.desc which stand for the private data and private descriptions such as
```javascript
var student = {
    name: "Hozaifa"
    email: "hea113"
}
```
name and email is the description for priv.desc and "Hozaifa" and "hea113" are the values or data for priv.data, however for     both we get '\n' characters.

* Enable the psd-api to search by email or userid
* Validation for email and userid
* Enable the psd-api to pass in an array of students and have it return an array of student objects

 
