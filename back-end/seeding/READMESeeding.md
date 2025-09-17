## Seeding Data

_The seeding scripts handle three main things:_

- Profile setup – creates a profile with business-specific details.
- Projects – creates a number of random projects associated with the profile.
- Variations – adds random variations to the projects.

_All steps are combined in fullSeed.js._

1. Before you run the scripts make sure you add these into you .env

`PROFILE_NAME=Your Default Profile Name`
`PROFILE_EMAIL=your.email@example.com`
`PROFILE_ID=default_user_id` this one you can find in the backend console when you log in with your email

2. Make sure your docker is running

3. Seeding proper:

- first do the following command, we want to do the seeding _inside_ the docker container

```
    cd docker
```

4. The default command to seed for YOUR profile is:

```
    docker exec -it variations-backend-1 node /app/seeding/fullSeed.js
```

_The scripts also accomodate for cases when we want to seed a specific clients account to showcase what our app cand do. To do that follow these steps:_

1. The client need to sign up with their email.

2. Find the client's id in MongoDB

3. Change into docker:

```
    cd docker
```

4. Run the script:

```
    docker exec -it variations-backend-1 node /app/seeding/fullSeed.js <"name lastName"> <email> <userId>
```
