# /acitivities

### Fields:   
- id: integer
- title: string
- subtitle: string
- dateFrom: datetime
- dateTo: datetime
- dateToIsProgramDay: boolean
- participationFee: string
- participationFeeCurrency: string
- participationFeeReduced: string
- participationFeeReducedCurrency: string
- eligibleReduction: string
- erasmusIsFunded: boolean
- erasmusGrantAgreementNumber: string
- erasmusActivityNumber: string
- erasmusActivityType: string
- longTermActivity: boolean
- mainWorkingLanguage: language array
- hasParticipantSelectProcedure: boolean
- isVisible: boolean
- canEditTravels: boolean
- canEditStays: boolean
- showToName: boolean
- showToMail: boolean
- showToPhone: boolean
- showToSkills: boolean
- project: reference one project
- mobilities: reference mobilities
- organisations: reference complex organisations
- places: reference places
- signUpForm: reference one complex signupform
- images: reference images
- files: reference files


### Request: 
##### GET /activities  

get a colletions of activities

#### POST /activities

#### GET /activities/{id}

#### PATCH /activities/{id}

#### DELETE /activities/{id}
