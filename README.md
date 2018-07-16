# KangnamShuttle

<img src="src/IMG_2DFB97E01FE7-1.jpeg" width="200" />

- 강남대학교의 셔틀버스 시간표를 안내하는 카카오톡 채팅 봇 입니다.

# Dev
## Set/Get env var

### Set
```
firebase functions:config:set someservice.key="THE API KEY"
```

### Get
```
firebase functions:config:get
```

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

## Input type

* text
* photo
* video
* audio