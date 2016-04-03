# Penn-State-Directory-API
API that obtains student information from the Penn State Directory.

### Things to be done
1. ~~Display Error Message if student is not found~~ 
2. ~~Checks if input is an object or string~~
3. ~~Allows you to search by firstname and lastname or just first name~~
4. Remove '\n' characters from the priv.data and priv.desc which stand for the private data and private descriptions such as
```javascript
var student = {
    name: "Hozaifa"
    email: "hea113"
}
```
⋅⋅⋅ name and email is the description for priv.desc and "Hozaifa" and "hea113" are the values or data for priv.data, however for     both we get '\n' characters.⋅⋅⋅

5. Enable the psd-api to search by email or userid
6. Validation for email and userid
7. Enable the psd-api to pass in an array of students and have it return an array of student objects

 
