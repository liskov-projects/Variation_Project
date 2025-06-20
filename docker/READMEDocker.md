# Here is a guide how to use the new Docker setup

## All the file related to Docker are stored in the docker directory, with the exeption of Dockerfile.dev (and later Dockerfile). Those are supposed to be in the root of the directory which is getting containerised

## To run the app in Docker:

1. remove the node_modules directory, if it is still there when you try to star container there'll be problems

```
    rm -rf front-end/node_modules
```

2. in terminal cd /docker
3. run the command:

```
   docker-compose -p variations up --build
```

This should be enough to work.

- to stop a running container use:

```
    docker-compose -p variations stop
```

- and to start it again:

```
    docker-compose -p variations start
```

## Note about node_modules

- if you are not careful with what node_modules you get inside your container you are sure to get errors;
- those will be errors about dependency mismatch or a package not being installed correctly
- to fix: 1. remove the container: either in docker desktop or using the command

```
    docker-compose -p variations down -v
```

the command above will remove all Docker containers, images, volumes and networks related to the project

2. delete the local node_modules,

```
    rm -rf front-end/node_modules
```

3.  rebuild with the same command

```
    docker-compose -p variations up --build
```

## Other useful things

- a total nuke of the Docker Compose project in case of some real trouble when the first command doesn't work:

```
    docker-compose down -v --rmi all --remove-orphans
```
