# Technical Sample for Lyft Software Engineering Apprenticeship

## The files in this repository are sample from front end and back end of Dinora.net. Full repository is private. 

## Dinora is a peer to peer money exchange platform that minimizes transaction fees.

### Front end sample can be found inside frontEndSample folder - offerForm.jsx

#### Description & Demo
The file is OfferForm class that handles:
1. Population of new offer form
2. Population of an existing offer (in case user wants to edit) 
3. Submission to back end. 
4. Validation of each field is accomplieshed by third party library - Joi.

![Form Demo](/demos/form.png)

### Backend sample can be found inside backEndSample folder - offers.js

#### Description
The file is a back end (money exchange offer CRUD) route that handles:
1. Creating new offer
2. Reading all offers and one specific offer
3. Updating an offer
4. Deleting an offer - only admin can delete
5. Authenticating user
6. Handling errors
7. Promises via async-await functions

Separate back end API:
1. GET requiest for all offers: https://dinora-api.herokuapp.com/api/offers
2. GET requiest for one offer. Please replace `offerId` with an actual id: https://dinora-api.herokuapp.com/api/offers/:offerId

Note: user auth is required for full functionality of the application

Link to Application:
https://www.dinora.net

