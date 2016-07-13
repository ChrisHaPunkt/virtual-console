Virtual Console
=======

#### Play your ```JavaScript``` games developed against our own [GameApi](/..), or embed other sites' HTML5 / JS games.
Virtual Console is a `NodeJS` based gaming console application with controller and **hardware emulation**.  
  
A project by 3 students of the [University of Appied Sciences Kiel](https://www.fh-kiel.de/).

-----
Quick links

[Run Scripts](scripts/)

[Node Server Overview](NodeServer/)

[Public Files (Clients / Frontend)](NodeServer/public/)

[Routes](NodeServer/routes/)

[Server Sources](NodeServer/sources/)

[Views](NodeServer/views/)

Install
=======

## Requirements

What is needed to run the application?
-----

### Operating Systems
If u want to use the ***hardware emulation*** u have to use one of the following OS for the application:  
(This is due to the uinput nodejs plugin, which dont compile on other operating systems.)
#### Supported Unix distributions
- Debian and all Debain based flavours

#### Unsupported Unix distributions
- OS X

#### Other OS'
- Windows

#### The application, ***without hardware emulation***, runs on all systems with the following prequisites:  

* MongoDB
* NodeJS 
  * npm

The application starts itself a MongoDB instance as configured in the ```config.json```.

## Install

To install the application, clone the repository to your host:  
```
git clone [RepoUrl](http://gitlab.de)
```
----

After that, create your own `package.json` in the **NodeServer/** directory, based on the template file there.  
Alter the `config.json` to fit your own needs. (Keep in mind, port 80 requires root privileges to bind)

THe app.sh file bundles all to run the application.
Run the following command to build the NodeServer package requirements:
```
app.sh prepDeps
```
----
Start the application with:  
```language=bash
app.sh start
```
The aplication starts, acces the menu with:
```
http://localhost:<configured_port>/menu
```
Access the controller with
```
http://localhost:<configured_port>/
```

----
To stop the application: 
```language=bash
app.sh stop
```

