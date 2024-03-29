var assert = require("assert");
const request = require("request");


describe("Webscrapper Tests with Mocha", function () {
  describe("Test users", function () {
    describe("User auth", async function () {
      var myurl = "http://localhost:3000";
      it("Fail 1. POST - Test invalid email - failed signup", function () {
        let data = {
          email: "user1#gmail@com",
          password: "pass123",
        };
        request.post(
          {
            headers: { "content-type": "application/json" },
            url: myurl + "/signup",
            body: JSON.stringify(data),
          },
          function (error, response, body) {
            assert.strictEqual(body, "Error. Signup Failed. Invalid email");
          }
        );
      });
      it("Fail 2. POST - Test invalid password - failed signup", function () {
        let data = {
          email: "user1@gmail.com",
          password: "pass123_#",
        };
        request.post(
          {
            headers: { "content-type": "application/json" },
            url: myurl + "/signup",
            body: JSON.stringify(data),
          },
          function (error, response, body) {
            assert.strictEqual(body, "Error. Signup Failed. Invalid password");
          }
        );
      });
      it("Fail 3. POST - Test invalid email - failed login", function () {
        let data = {
          email: "user1#gmail@com",
          password: "pass123",
        };
        request.post(
          {
            headers: { "content-type": "application/json" },
            url: myurl + "/login",
            body: JSON.stringify(data),
          },
          function (error, response, body) {
            assert.strictEqual(body, "Error. Login Failed. Invalid email");
          }
        );
      });
      it("Fail 4. POST - Test invalid password - failed login", function () {
        let data = {
          email: "user1@gmail.com",
          password: "pass123_#",
        };
        request.post(
          {
            headers: { "content-type": "application/json" },
            url: myurl + "/login",
            body: JSON.stringify(data),
          },
          function (error, response, body) {
            assert.strictEqual(body, "Error. Login Failed. Invalid password");
          }
        );
      });
      it("Fail 5. GET - Test invalid email (failed getOne)", function () {
        let email = "user1#gmail@com";

        request.get(
          {
            headers: { "content-type": "application/json" },
            url: myurl + "/" + email,
          },
          function (error, response, body) {
            assert.strictEqual(body, "Error. user not found.");
          }
        );
      });
      it("Fail 6. PUT - Test invalid email (failed updateOne)", function () {
        let email = "user1#gmail@com";
        request.put(
          {
            headers: { "content-type": "application/json" },
            url: myurl + "/" + email,
          },
          function (error, response, body) {
            assert.strictEqual(body, "Error. Email is invalid.");
          }
        );
      });
      it("Fail 7. DELETE - Test invalid email (failed deleteOne)", function () {
        let email = "user1#gmail@com";
        request.delete(
          {
            headers: { "content-type": "application/json" },
            url: myurl + "/" + email,
          },
          function (error, response, body) {
            assert.strictEqual(body, "Error. user not found.");
          }
        );
      });

      it("Success 1. GET - All User", function () {
        request.get(
          {
            headers: { "content-type": "application/json" },
            url: myurl + "/users",
          },
          function (error, response, body) {
            console.log("-------- Listing all Users. --------");
            console.log(body);
          }
        );
      });
      it("Success 2. GET - Valid User - LogIn", function () {
        let data = {
          email: "user1@gmail.com",
          password: "pass123",
        };
        request.get(
          {
            headers: { "content-type": "application/json" },
            url: myurl + "/login",
            body: JSON.stringify(data),
          },
          function (error, response, body) {
            assert.strictEqual(body, "User logged in successfully.");
          }
        );
      });
      it("Success 3. Post - Add Valid User - Signup", function () {
        let data = {
          email: "user1@gmail.com",
          password: "pass123",
        };
        request.post(
          {
            headers: { "content-type": "application/json" },
            url: myurl + "/signup",
            body: JSON.stringify(data),
          },
          function (error, response, body) {
            assert.strictEqual(body, "User added - Signup successful.");
          }
        );
      });
      it("Success 4. GET - User found (valid getOne)", function () {
        let email = "user1@gmail.com";

        request.get(
          {
            headers: { "content-type": "application/json" },
            url: myurl + "/" + email,
          },
          function (error, response, body) {
            assert.strictEqual(body, "User found.");
          }
        );
      });
      it("Success 5. DELETE - Valid User (deleteOne),", function () {
        let email = "user1@gmail.com";

        request.delete(
          {
            headers: { "content-type": "application/json" },
            url: myurl + "/" + email,
          },
          function (error, response, body) {
            assert.strictEqual(body, "Contact deleted.");
          }
        );
      });
      it('Success 6. PUT - Update Valid User(updateOne),', function(){
        let data = {
            email: 'user1@gmail.com', 
            password: "pass123",
        };
        let up_data = {
            email: 'user2@gmail.com', 
            password: "pass456",
        };

        request.post({
            headers: {'content-type': 'application/json'},
            url:     myurl+'/',
            body:    JSON.stringify(data)        
        }, function(error, response, body){
            request.put({
                headers: {'content-type': 'application/json'},
                url:     myurl+'/'+email,
                body:    JSON.stringify(up_data)
            }, function(error, response, body){
                assert.strictEqual(body,'user correctly updated.');
            });
        });
    });

    });
  });
});
