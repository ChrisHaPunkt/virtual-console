/**
 * Created by chrisheinrichs on 05.11.15.
 */



define(['jquery', 'three', 'gameApi'], function ($, THREE, gameApi) {

        /**
         * ------------- ApiInitialization Part -------------
         */

        /**
         *
         * @type {number}
         */
        gameApi.logLevel = gameApi.log.DEBUG;
        gameApi.controller = gameApi.controllerTemplates.MODERN;



        /**
         * Handle new Controller Data
         * @param controllerData
         */
        gameApi.frontendInboundMessage = function (controllerData) {
            var controllerEvent = controllerData.data.message;
            gameApi.addLogMessage(gameApi.log.DEBUG,"on.FrontendInboundMessage" , controllerData);
            var msgDetails = typeof controllerData.data.message === "object" ? JSON.stringify(controllerData.data.message) : controllerData.data.message;
            gameApi.addLogMessage(gameApi.log.INFO, 'client', controllerData.data.clientName + ': ' + msgDetails);


            switch (controllerData.type) {
                case "button":
                    if (controllerEvent.buttonName == 'btn-left' && controllerEvent.buttonState === gameApi.BUTTON.DOWN) {

                        var a = 200 * Math.random();
                        var b = 200 * Math.random();
                        var c = 200 * Math.random();


                        GameHandler.adjustCubeSize(0, {x: a, y: b, z: c});
                        //GameHandler.setRotationRelative(0,{x:a,y:b,z:c});
                    }
                    else if (controllerEvent.buttonName == 'btn-right' && controllerEvent.buttonState === gameApi.BUTTON.DOWN) {

                    }
                    break;
                case "accelerationData":

                    break;
                case "orientationData":
                    var timestamp = Date.now();
                    gameApi.addLogMessage(gameApi.log.DEBUG, "Delay",  (timestamp - controllerEvent.timestamp)  + " ms");

                    GameHandler.setRotationRelative(0, {
                        x: controllerEvent.orientationAlpha,
                        y: controllerEvent.orientationBeta,
                        z: controllerEvent.orientationGamma
                    });
                    break;
                default:
                    break;
            }

        };
        /**
         * Local Game Initialization
         * @param connInfoObj
         */
        gameApi.frontendConnection = function (connInfoObj) {
            gameApi.addLogMessage(gameApi.log.INFO, 'conn', connInfoObj + " " + gameApi.socket.id);

            this.emit('frontendOutboundMessage', {type: 'setControllerTemplate', data: gameApi.controller});
        };

        var gameInstance = gameApi.init();


        if (gameInstance !== -1) {


            var ROTATE = {
                CONTINOUSLY: 1,
                RELATIVE: 2
            };
            var GameHandler = {

                domContainer: $("#3d"),

                scene: new THREE.Scene(),
                camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000),

                gameObjects: [],

                changeControllerTemplate: function(newControllerTemplate){
                    gameApi.addLogMessage(gameApi.log.INFO, "GameApi", "Switch Controller Layout To: "+ newControllerTemplate);
                    gameApi.controller = newControllerTemplate;
                    gameApi.socket.emit('frontendOutboundMessage', {type: 'setControllerTemplate', data: gameApi.controller});
                },

                /** Creating and configuring the renderer (plate)
                 *
                 * @type {THREE.WebGLRenderer}
                 */
                renderer: new THREE.WebGLRenderer({alpha: true}),
                initRenderer: function () {
                    this.renderer.setSize(this.domContainer.innerWidth(), this.domContainer.innerHeight());
                    this.renderer.setClearColor(0, 0, 0, 0);
                    this.domContainer.append(this.renderer.domElement);
                },

                addNewGameObj: function (params) {
                    var newObj = {
                        id: this.gameObjects.length
                    };

                    newObj.cube = this.createCube();
                    newObj.rotate = {
                        status: false,
                        x: 0,
                        y: 0,
                        z: 0
                    };

                    if (this.gameObjects.length != 0) {
                        var xPos = $("#3d").find("canvas").innerWidth() / (this.gameObjects.length + 1);
                        if (this.gameObjects.length % 2 == 1) {
                            xPos *= -1;
                        }

                        if (params.rotate) {
                            newObj.rotate = {
                                x: params.rotate.x,
                                y: params.rotate.y,
                                z: params.rotate.z
                            }
                        }
                        newObj.cube.position.x = xPos;
                    }

                    this.gameObjects.push(newObj);
                    this.scene.add(this.gameObjects[this.gameObjects.length - 1].cube);
                },
                removeGameObj: function (id) {
                    this.scene.remove(this.gameObjects[id].cube);
                    this.gameObjects.splice(id, 1);
                },
                initCameraPosition: function (position) {
                    this.camera.position.z = position;
                },

                adjustCubeSize: function (cubeId, paramsXYZ) {
                    this.gameObjects[cubeId].cube.scale.x = (paramsXYZ.x) ? paramsXYZ.x / 100 : this.gameObjects[cubeId].cube.scale.x;
                    this.gameObjects[cubeId].cube.scale.y = (paramsXYZ.y) ? paramsXYZ.y / 100 : this.gameObjects[cubeId].cube.scale.y;
                    this.gameObjects[cubeId].cube.scale.z = (paramsXYZ.z) ? paramsXYZ.z / 100 : this.gameObjects[cubeId].cube.scale.z;
                },
                setRotationParams: function (paramsXYZ, cubeId) {
                    if (paramsXYZ.x == 0 && paramsXYZ.y == 0 && paramsXYZ.z == 0) {
                        this.gameObjects[cubeId].rotate.status = false;
                        this.gameObjects[cubeId].rotate.x = 0;
                        this.gameObjects[cubeId].rotate.y = 0;
                        this.gameObjects[cubeId].rotate.z = 0;
                    } else {
                        this.gameObjects[cubeId].rotate.status = true;
                        if (this.gameObjects[cubeId].rotate.type == ROTATE.CONTINOUSLY) {

                            this.gameObjects[cubeId].rotate.x = (paramsXYZ.x) ? paramsXYZ.x / 1000 : this.gameObjects[cubeId].rotate.x;
                            this.gameObjects[cubeId].rotate.y = (paramsXYZ.y) ? paramsXYZ.y / 1000 : this.gameObjects[cubeId].rotate.y;
                            this.gameObjects[cubeId].rotate.z = (paramsXYZ.z) ? paramsXYZ.z / 1000 : this.gameObjects[cubeId].rotate.z;
                        } else if (this.gameObjects[cubeId].rotate.type == ROTATE.RELATIVE) {

                            this.gameObjects[cubeId].rotate.x = (paramsXYZ.x) ? (paramsXYZ.x / 1000 ) + this.gameObjects[cubeId].rotate.x : this.gameObjects[cubeId].rotate.x;
                            this.gameObjects[cubeId].rotate.y = (paramsXYZ.y) ? (paramsXYZ.y / 1000 ) + this.gameObjects[cubeId].rotate.y : this.gameObjects[cubeId].rotate.y;
                            this.gameObjects[cubeId].rotate.z = (paramsXYZ.z) ? (paramsXYZ.z / 1000 ) + this.gameObjects[cubeId].rotate.z : this.gameObjects[cubeId].rotate.z;
                        }
                    }
                },
                setRotationContinously: function (cubeId, paramsXYZ) {
                    this.gameObjects[cubeId].rotate.type = ROTATE.CONTINOUSLY;
                    this.setRotationParams(paramsXYZ, cubeId);
                },
                setRotationRelative: function (cubeId, paramsXYZ) {
                    this.gameObjects[cubeId].rotate.type = ROTATE.RELATIVE;
                    this.setRotationParams(paramsXYZ, cubeId);
                },
                /**
                 * Renderloop
                 */
                render: function () {
                    requestAnimationFrame(this.render.bind(this));

                    //Iterate Object prefs

                    $.each(this.gameObjects, function (index, elem) {
                        if (elem.rotate.status) {

                            if (elem.rotate.type == ROTATE.CONTINOUSLY) {
                                elem.cube.rotation.x += elem.rotate.x;
                                elem.cube.rotation.y += elem.rotate.y;
                                elem.cube.rotation.z += elem.rotate.z;
                            } else if (elem.rotate.type == ROTATE.RELATIVE) {
                                elem.cube.rotation.x = elem.rotate.x;
                                elem.cube.rotation.y = elem.rotate.y;
                                elem.cube.rotation.z = elem.rotate.z;
                            }
                        } else {
                            //
                        }

                    });

                    this.renderer.render(this.scene, this.camera);
                }
                ,

                createCube: function () {

                    var geometry = new THREE.BoxGeometry(700, 700, 700, 10, 10, 10);
                    var material = new THREE.MeshBasicMaterial({color: 0xfffff, wireframe: true});
                    return new THREE.Mesh(geometry, material);
                }
            }

        }

        GameHandler.initRenderer();
        GameHandler.addNewGameObj();
        GameHandler.initCameraPosition(1000);
        GameHandler.render();

        GameHandler.setRotationContinously(0, {x: 0, y: 10, z: 0});

        // return public interface of the require module
        return GameHandler;

    }
)
;