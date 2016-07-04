## TODO @hannes @chrish

# Routen

## GameRoutes

### How are the games dynamically bound to routes?  

We were not able to rebind a route on an NodeJS express app without restarting the whole application.  
If the games are updated or added, we need a new binding for the game, beause its contents may changed.
So a global counter is used to reinitialize the routes.  
When the games are fetched from the database (for example after a game changed or added) they got their own unique url to be bound to. For doing so the global counter is increased by one for each game.  

------



## Controller / Menu