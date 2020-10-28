# DIDE

This project is Angular-Meteor application. 

## Installation

1. Install meteor

For OSX / linux systems
```bash
curl https://install.meteor.com/ | sh
```

For Windows systems
```bash
choco install meteor
```

2. Install angular

```bash
npm install -g @angular/cli
```

## Configuration

1. Go to the api folder and remove node_modules, package_lock, and yarn.lock
2. Create a new symbolic link

For OSX / linux system
```bash
cd <PATH TO FILE>/dide/api
ln -s ../package.json 
ln -s ../yarn.lock 
ln -s ../tsconfig.json
ln -s ../node_modules
```

For Windows system 
``` run cmd ``` as admin and execute
```bash
C:\WINDOWS\system32>mklink /D C:\<PATH TO FILE>\dide\api\yarn.lock C:\<PATH TO FILE>\dide\yarn.lock
C:\WINDOWS\system32>mklink /D C:\<PATH TO FILE>\dide\api\package.lock C:\<PATH TO FILE>\dide\package.lock
C:\WINDOWS\system32>mklink /D C:\<PATH TO FILE>\dide\api\node_modules C:\<PATH TO FILE>\dide\node_modules
```

## Usage
1. Open powershell go to the dide project
2. In the first powershell tab run
```bash
npm run api
```
3. In the first powershell tab run
```bash
npm run app
```

## Mis
In the case that if there exist a process running on port 3000, use the following to kill the process
```bash
netstat -ano | findstr :3000
  TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       2888
taskkill /PID 2888 /F
SUCCESS: The process with PID 2888 has been terminated.
```

