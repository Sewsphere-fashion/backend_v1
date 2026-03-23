import http from "k6/http";
import { check, sleep } from "k6";
// import userRoute from "../Users/user.route.js";


// // load testing
// export const options = {
//   vus: 100,
//   duration: "20s",
// };

// const users = [
//   { email: "test1+dummy@yourdomain.com", password: "Test123!" },
//   { email: "test2+dummy@yourdomain.com", password: "Test123!" },
//   { email: "test3+dummy@yourdomain.com", password: "Test123!" },
//   { email: "test4+dummy@yourdomain.com", password: "Test123!" },
//   { email: "test5+dummy@yourdomain.com", password: "Test123!" },
//   { email: "test6+dummy@yourdomain.com", password: "Test123!" },
//   { email: "test7+dummy@yourdomain.com", password: "Test123!" },
//   { email: "test8+dummy@yourdomain.com", password: "Test123!" },
//   { email: "test9+dummy@yourdomain.com", password: "Test123!" },
//   { email: "test10+dummy@yourdomain.com", password: "Test123!" },
// ];

// export default function(){
//     const user = users[Math.floor(Math.random() * users.length)]

//     const payload =JSON.stringify({
//     email:user.email,
//     password:user.password
// })
// const params = {headers:{"Content-Type":"application/json"}}
// const res = http.post("http://localhost:8080/api/users/login",payload,params)

// check(res,{"login succeeded":(r)=>r.status === 201})

// sleep(1)
// }


// stress testing
export let options = {
  stages: [
    { duration: "10s", target: 5 },   // start with 5 users
    { duration: "20s", target: 20 },  // gradually increase to 20 users
    { duration: "20s", target: 50 },  // increase to 50 users (stress)
    { duration: "10s", target: 0 },   // ramp-down to 0
  ],
};

export default function () {
  let res = http.post("http://localhost:8080/api/users/login", {
  email: "test1+dummy@yourdomain.com",
   password: "Test123!" ,
  });

  // Check if login succeeded
  check(res, {
    "login succeeded": (r) => r.status === 201,
  });

  sleep(1); // simulate user think time
}
