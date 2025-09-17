# Here is a guide how to use the new Docker setup

## All the file related to Docker are stored in the docker directory, with the exeption of Dockerfile.dev (and later Dockerfile). Those are supposed to be in the root of the directory which is getting containerised

## To run the app in Docker:

_I'd recommend getting docker desktop - it's easier to inspect containers and controll what you've got running_

1. remove the node_modules directory, if it is still there when you try to star container there'll be problems

```
    rm -rf front-end/node_modules
```

2. make sure .env is in docker directory and REMOVE .env from the back-end & front-end

3. in terminal cd /docker

4. run the command:

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

- In case you need to do the seeding here's the command. As we want to allow for potential clients, the end part with name and email are optional

```
    docker exec -it variations-backend-1 node /app/seeding/fullSeed.js <"name lastName"> <email>
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

- if we want to run a single file we can do it from the container, especially if we use .env

```
    cd docker
    node ../back-end/mailTest.js
```

if we do it from the back-end .env remain undefined
