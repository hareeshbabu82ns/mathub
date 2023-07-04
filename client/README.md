# MathHub

Simple Math Questions and Answers for kids

# Create Release
```sh
yarn release
```

# Run locally
```sh
yarn
yarn start
```

# Docker Build
```sh
docker build . -t mathub-ui
```

# Docker Run
```sh
docker run -d -p 3000:80 --name mathub-ui mathub-ui

docker rm -f mathub-ui
```