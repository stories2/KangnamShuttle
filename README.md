# KangnamShuttle

## Trouble shooting 
- Cannot start emulate firebase functions
[reference](https://github.com/firebase/firebase-tools/issues/442)
```
sudo npm install -g firebase-tools

sudo npm install -g grpc --allow-root --unsafe

cd /path/to/global/node_modules/firebase-tools/node_modules

sudo rm -rf grpc

ln -s /path/to/node_modules/grpc/ /path/to/node_modules/firebase-tools/node_modules/grpc

cd /to/your/project/functions

firebase serve --only functions
```

- Undefined env variable
```
firebase functions:config:get > .runtimeconfig.json
``` 

## Deployment

After coded if you want deploy to cloud server, please type it in terminal.
```
firebase deploy --only functions
```

And this is how to deploy hosting
```
firebase deploy --only hosting
```

## Run

If you want run this project locally, please type it in terminal.
```
sudo firebase serve --only functions
```