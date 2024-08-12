# Components
1. **npm** package manager for JavaScript
2. **Express** minimal and flexible Node.js web application framework that handles HTTP requests, manages routing, and supports middleware
3. **CORS** (Cross-Origin Resource Sharing) mechanism that uses HTTP headers to allow a web application running at one origin to access resources from a different origin
4. **Mongoose** Object Data Modeling (ODM) library for MongoDB and Node.js, providing a schema-based solution to model application data
5. **dotenv** lightweight module that loads environment variables from a `.env` file into `process.env` for Node.js applications
6. **nodemon** automatically restarts when file changes in the directory
7. **JWT** (JSON Web Token) secure, time-limited pass to prove your identity to a website and access it
8. **Bcrypt** securely hashes passwords by adding extra steps (salt rounds)

# `props` Argument in Mongoose Schema Validation
In Mongoose schema validation, the `props` argument is an object provided to the `message` function when a validation error occurs
- `value`:The actual value of the field that failed validation
- `path`:path (or name) of the field in the schema that failed validation
- `reason` (Optional): reason for the validation failure, if available


# Command Line Used 
1. `mkdir server` > `cd server`
2. `mkdir dir_name` > `cd dir_name`
3. `npm init -y` 
4. `npm install express cors mongoose dotenv` 
5. `npm install nodemon`
6. `npx nodemon file_name.js` : To run
7. `node -e "console.log(require('crypto').randomBytes(64).toString('base64'));"` : For generating jwt_secret_key

# Git Commands Used
1. `git init` : adds git to the current dir
2. `git remote add origin https://github.com/Octothrop/FMS.git`
3. `git remote -v` : To check if the orgin is added
4. `git add ./*` : To add current file in the dir
5. `git -m commit 'message'` 
6. `git branch` : To check current branch
7. `git push origin branch_name` 
8. `git fetch origin` : Detects new branches
9. `git checkout branch_name` : Changes current to branch_name
10. `git merge other_branch` : merges two branch

# Note :
- Commit once any merge or changes made and push it to origin
- geospatial index is a specialized index that allows MongoDB to efficiently query and perform operations on geographic data - queries like finding documents within a certain radius or near a specific point
