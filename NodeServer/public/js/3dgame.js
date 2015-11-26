/**
 * Created by chrisheinrichs on 05.11.15.
 */
var GameHandler = {

        domContainer: $("#3d"),

        scene: new THREE.Scene(),
        camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000),

        gameObjects: [],


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
                x:0,
                y:0,
                z:0
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
            this.gameObjects[cubeId].cube.scale.x = (paramsXYZ.x) ? paramsXYZ.x : this.gameObjects[cubeId].cube.scale.x;
            this.gameObjects[cubeId].cube.scale.y = (paramsXYZ.y) ? paramsXYZ.y : this.gameObjects[cubeId].cube.scale.y;
            this.gameObjects[cubeId].cube.scale.z = (paramsXYZ.z) ? paramsXYZ.z : this.gameObjects[cubeId].cube.scale.z;
        },
        setRotationRelative: function (cubeId, paramsXYZ) {

            if (paramsXYZ.x == 0 && paramsXYZ.y == 0 && paramsXYZ.z == 0) {
                this.gameObjects[cubeId].rotate.status = false;
                this.gameObjects[cubeId].rotate.x = 0;
                this.gameObjects[cubeId].rotate.y = 0;
                this.gameObjects[cubeId].rotate.z = 0;
            } else {
                this.gameObjects[cubeId].rotate.status = true;
                this.gameObjects[cubeId].rotate.x = (paramsXYZ.x) ? paramsXYZ.x : this.gameObjects[cubeId].rotate.x;
                this.gameObjects[cubeId].rotate.y = (paramsXYZ.y) ? paramsXYZ.y : this.gameObjects[cubeId].rotate.y;
                this.gameObjects[cubeId].rotate.z = (paramsXYZ.z) ? paramsXYZ.z : this.gameObjects[cubeId].rotate.z;
            }
        },
        /**
         * Renderloop
         */
        render: function () {
            requestAnimationFrame(this.render.bind(this));

            //Iterate Object prefs

            $.each(this.gameObjects, function (index, elem) {
                if (elem.rotate.status) {

                    elem.cube.rotation.x += elem.rotate.x;
                    elem.cube.rotation.y += elem.rotate.y;
                    elem.cube.rotation.z += elem.rotate.z;
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
    ;

GameHandler.initRenderer();
GameHandler.addNewGameObj();
GameHandler.initCameraPosition(1000);
GameHandler.render();