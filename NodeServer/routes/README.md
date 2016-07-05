# Routes

Both the frontend and the controllers are invoked by a URL-call on a specific route.
The frontend will be called automatically during the start of the virtual console application. The route is fixed bound to ```[hostname]:[PORT]/menu``` and will bring up the **main menu**.
Afterwards the user can call the controller on his/her smartphone by calling the URL ```[hostname]:[PORT]``` or reading out the QR code presented on the frontend which also leads to the **controller route**.
When the user starts a game the specific **game route** is called automatically by the application.

Whenever a route gets called the corresponding HTML Jade template is rendered and send to the client.

## Game Routes
Each internally game (programmed against the ```Game API```) has its own route. Also each external game has its own route which will bring up the same view rendered each with its corresponding game URL in an iFrame.

### How are the games dynamically bound to routes?  

We were not able to rebind a route on an NodeJS express app without restarting the whole application. If the games are updated or added, we need a new binding for the game, because its contents may changed. So a global counter is used to reinitialize the routes.
When the games are fetched from the database (for example after a game changed or added) they got their own unique URL to be bound to. For doing so the global counter is increased by one for each game.  

## Controller Route

Whenever the controller route is called all available controller templates are rendered into one big HTML string. This string is then used to render the main template of the controller page where each controller is included as a single DIV element.
Only the main controller template contains the references to a controller JS and any CSS files. The specific controller stylesheets are dynamically loaded into an initially empty link TAG whenever the client receives the specific command from the server.
Doing so only one stylesheet is active at a time and no conflicting Classes or IDs can occur.