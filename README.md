# 3dh

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Create docker image
Pour x86:
- docker build -t f80hub/3dh-x86 . && docker push f80hub/3dh-x86
- docker run -it -p 8080:80 --rm --name 3dh f80hub/3dh-x86

For Arm:
After Docker installation:
- docker build -t f80hub/3dh-arm . && docker push f80hub/3dh-arm
- sudo docker rm -f 3dh && sudo docker pull f80hub/3dh-arm && sudo docker run -d -p 8080:80 --rm --name 3dh f80hub/3dh-arm


