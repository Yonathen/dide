# LoIDE

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
ln -s ../package.json 
ln -s ../yarn.lock 
ln -s ../tsconfig.json
ln -s ../node_modules
```

For Windows system 
``` run cmd ``` as admin and execute
```bash
C:\WINDOWS\system32>mklink /D C:\<PATH TO FILE>\loide\api\yarn.lock C:\<PATH TO FILE>\loide\yarn.lock
C:\WINDOWS\system32>mklink /D C:\<PATH TO FILE>\loide\api\package.lock C:\<PATH TO FILE>\loide\package.lock
C:\WINDOWS\system32>mklink /D C:\<PATH TO FILE>\loide\api\node_modules C:\<PATH TO FILE>\loide\node_modules
```

## Usage
1. Open powershell go to the loide project
2. In the first powershell tab run
```bash
npm run api
```
3. In the first powershell tab run
```bash
npm run app
```
