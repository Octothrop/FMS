# FMS
Multi-Service, API Gateway-Driven Agricultural Market Platform with Multilingual Integration


# Run Login-Auth service
Move to the *login-auth* directory in serevr folder > `npx nodemon main.js`

# Routes
- Register `http://localhost:5000/api/auth/register`
- Login `http://localhost:5000/api/auth/login`
- Forgot password `http://localhost:5000/api/auth/forgotpassword`
- Sell `http://localhost:5001/api/commerce/sell/:sellerId` *Replace sellerId*
- Buy `http://localhost:5001/api/commerce/buy/:userId/:cropId` *Replace userId and cropId*
- update crop `http://localhost:5001/api/commerce/updateCrop/:id` *Replace id with cropId*