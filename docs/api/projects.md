# /projects

### Fields:   
- id: integer
- title: string 
- subtitle: string  
- description: text  
- dateFrom: date  
- dateTo: date  
- fundingText:text  
- isErasmusFunded: boolean  
- grantAgreementNumber: string  
- isVisible: boolean
- organisations: reference organisation
- funderLogos: reference image
- images:   reference image
- logo: reference image
- activities: soft reference activity


### Request: 
##### GET /projects  

get a colletions of projects

#### POST /projects

#### GET /projects/{id}

#### PATCH /projects/{id}

#### DELETE /projects/{id}