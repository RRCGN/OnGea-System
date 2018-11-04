# Api

## General

Prefix: /api/v2  
Format: ?_format=json / ?_formal=hal_json (fileupload)  
An alle Requests anhängen



#### Authorization: Basic
Header:
authorization Basic btoa(name:password)

additional information:
https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication


#### Authorization: Cookie
POST /user/login  
{  
    "name": "username",  
    "pass": "password"  
}  


#### X-CSRF-TOKEN
GET /rest/session/token
content-type application/json

#### Basic Authentication Request Example
GET /api/v2/activities?_format=json  
  
content-type application/json  
authorization Basic YXBpOmFwaQ==
x-csrf-token KZYWyfFtGfEqfLAxLyiQyLz9OIau41  


#### Cookie Authentication Request Example
GET /api/v2/activities?_format=json  
  
content-type application/json  
Cookie: SESS7f22feac82573de56281aacf42f08473=7jaM-23v_rgcThMqo2dIL51fc9aQq3ajCUmfaraUzCo  
x-csrf-token KZYWyfFtGfEqfLAxLyiQyLz9OIau41  


Response Header:  
Set-Cookie: SESS7f22feac82573de56281aacf42f08473=DUsnJWtwusKSz3k8QwgMEJktrxwz64wQB7QO3G__-t0  


### Logout
POST /user/logout?token=logout_token  
Response: 204 no content  

### Upload (hal_json)  
POST /entity/file?_format=hal+json
content-type application/hal+json

Body: /docs/api/upload/request.json

Response: 

### Scope
&scope=small
add as query parameter to get a smaller scope

### count
&count=10 
add as query parameter to get a maximum number of datasets
