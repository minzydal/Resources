import * as THREE from "./three.module.js"
import {OrbitControls} from "./OrbitControls.js"
import {GLTFLoader} from './GLTFLoader.js'

class App{
    constructor(){
        const width = window.innerWidth;
        this._width = width;
        const height = window.innerHeight;
        this._height = height;
        const renderer = new THREE.WebGLRenderer({ antialias: true,powerPreference:"high-performance" });
        this._renderer = renderer;
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio * 2);
        //renderer.shadowMap.enabled = true;
        //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        const manager = new THREE.LoadingManager();
        const loader = new GLTFLoader(manager);
        this._loader = loader;
        document.body.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        this._scene = scene;
        const raycast = new THREE.Raycaster();
        this._raycast = raycast;
        const pointer = new THREE.Vector2();
        this._pointer = pointer;
        this._pointer.x = -1;
        this._pointer.y = -1;
        this._intersected;
        this._selected;
        this._isready = false;
        this._rendeready = true;
        const arr = ["LSH","LTHT","LARM","LHND","LUMB","LLEG","LKNE","LBMB","LFOT",
                     "RSH","RTHT","RARM","RHND","RUMB","RLEG","RKNE","RBMB","RFOT"];
        this._arr = arr;
        this._setupModels();
        this._setupCamera();
        this._setupLights();
        this._setupControls();
        this._loadCompleted = false;
        manager.onProgress = (url, loaded, total) => {
            this._sendToPlatform("loading", { progress: (loaded / total) * 100 });
        };

        manager.onLoad = () => {
            this._sendToPlatform("webStart", null);
            this._render();
        };

    }
    
    _sendToPlatform(method, data) {
        if (typeof window.Android !== "undefined") {
            // Android 메시지 처리
            if (method === "loading") {
                window.Android.loading(data.progress);
            } else if (method === "webStart") {
                window.Android.webStart();
            } else if (method === "log") {
                window.Android.log(data.message);
            } else if (method === "getBlob") {
                window.Android.getBlob(data.base64);
            }
        } else if (typeof window.webkit !== "undefined" && typeof window.webkit.messageHandlers !== "undefined") {
            // iOS 메시지 처리
            if (method === "loading") {
                window.webkit.messageHandlers.loading.postMessage(data.progress);
            } else if (method === "webStart") {
                window.webkit.messageHandlers.webStart.postMessage(null);
            } else if (method === "log") {
                window.webkit.messageHandlers.log.postMessage(data.message);
            } else if (method === "getBlob") {
                window.webkit.messageHandlers.getBlob.postMessage(data.base64);
            }
        } else {
            console.log(`[Platform] ${method}:`, data);
        }
    }
    _loadModels(location,flip,rotation,pivot,axes,name){
        this._loader.load(location,(gltf)=>{
            const root = gltf.scene; //root 는 group
            root.scale.set(100,100,100);
            root.rotation.x = rotation.x;
            root.rotation.y = rotation.y;
            root.rotation.z = rotation.z;
            switch(flip){
                case "x" :
                    root.scale.x *= -1;
                    break;
                case "y" :
                    root.scale.y *= -1;
                    break;
                case "z" :
                    root.scale.z *= -1;
                    break;
                default :
                    break;
            }
            root.axes = axes;
            pivot.add(root);
            root.traverse((child) => {
                child.castShadow = true;
                child.receiveShadow = true;
                child.side = THREE.FrontSide;

            })
            root.children[0].name = name;
            root.children[0].axes = axes;
            root.name = name;
        });
    }
    _setupModels(){
        const Robot = new THREE.Group();//axis 포함
        const pivot_Body = new THREE.Object3D();
        pivot_Body.name = "pivot-body";
        const pivot_LSH = new THREE.Object3D();
        pivot_LSH.name = "pivot-LSH";
        const pivot_LARM = new THREE.Object3D();
        pivot_LARM.name = "pivot-LARM";
        const pivot_LHND = new THREE.Object3D();
        pivot_LHND.name = "pivot-LHND";
        const pivot_LTHT = new THREE.Object3D();
        pivot_LTHT.name = "pivot-LTHT";
        const pivot_LUMB = new THREE.Object3D();
        pivot_LUMB.name = "pivot-LUMB";
        const pivot_LLEG = new THREE.Object3D();
        pivot_LLEG.name = "pivot-LLEG";
        const pivot_LKNE = new THREE.Object3D();
        pivot_LKNE.name = "pivot-LKNE";
        const pivot_LBMB = new THREE.Object3D();
        pivot_LBMB.name = "pivot-LBMB";
        const pivot_LFOT = new THREE.Object3D();
        pivot_LFOT.name = "pivot-LFOT";

        const pivot_RSH = new THREE.Object3D();
        pivot_RSH.name = "pivot-RSH";
        const pivot_RARM = new THREE.Object3D();
        pivot_RARM.name = "pivot-RARM";
        const pivot_RHND = new THREE.Object3D();
        pivot_RHND.name = "pivot-RHND";
        const pivot_RTHT = new THREE.Object3D();
        pivot_RTHT.name = "pivot-RTHT";
        const pivot_RUMB = new THREE.Object3D();
        pivot_RUMB.name = "pivot-RUMB";
        const pivot_RLEG = new THREE.Object3D();
        pivot_RLEG.name = "pivot-RLEG";
        const pivot_RKNE = new THREE.Object3D();
        pivot_RKNE.name = "pivot-RKNE";
        const pivot_RBMB = new THREE.Object3D();
        pivot_RBMB.name = "pivot-RBMB";
        const pivot_RFOT = new THREE.Object3D();
        pivot_RFOT.name = "pivot-RFOT";

        const pivot_HEAD = new THREE.Object3D();
        pivot_HEAD.name = "pivot-HEAD";

        this._loadModels('body.gltf',"",{x:0,y:0,z:0},pivot_Body,"y","body");
        this._loadModels("SHD.gltf","",{x:0,y:0,z:0},pivot_LSH,"-x","LSH");
        this._loadModels("ARM.gltf","",{x:0,y:0,z:0},pivot_LARM,"z","LARM");
        this._loadModels("HND.gltf","",{x:0,y:0,z:0},pivot_LHND,"z","LHND");
        this._loadModels("THT.gltf","",{x:0,y:0,z:0},pivot_LTHT,"y","LTHT");
        this._loadModels("MOTBOX.gltf","",{x:0,y:0,z:0},pivot_LUMB,"z","LUMB");
        this._loadModels("LEG.gltf","x",{x:0,y:0,z:0},pivot_LLEG,"-x","LLEG");
        this._loadModels("KNEE.gltf","",{x:0,y:0,z:0},pivot_LKNE,"-x","LKNE");
        this._loadModels("MOTBOX.gltf","x",{x:0,y:-Math.PI/2,z:0},pivot_LBMB,"x","LBMB");
        this._loadModels("FOOT.gltf","",{x:0,y:0,z:0},pivot_LFOT,"-z","LFOT");
        this._loadModels("SHD.gltf","x",{x:0,y:0,z:0},pivot_RSH,"x","RSH");
        this._loadModels("ARM.gltf","",{x:0,y:0,z:0},pivot_RARM,"z","RARM");
        this._loadModels("HND.gltf","x",{x:0,y:0,z:0},pivot_RHND,"z","RHND");
        this._loadModels("THT.gltf","x",{x:0,y:0,z:0},pivot_RTHT,"y","RTHT");
        this._loadModels("MOTBOX.gltf","x",{x:0,y:0,z:0},pivot_RUMB,"z","RUMB");
        this._loadModels("LEG.gltf","",{x:0,y:0,z:0},pivot_RLEG,"x","RLEG");
        this._loadModels("KNEE.gltf","x",{x:0,y:0,z:0},pivot_RKNE,"x","RKNE");
        this._loadModels("MOTBOX.gltf","",{x:0,y:Math.PI/2,z:0},pivot_RBMB,"-x","RBMB");
        this._loadModels("FOOT.gltf","x",{x:0,y:0,z:0},pivot_RFOT,"-z","RFOT");
        this._loadModels("HEAD.gltf","",{x:0,y:0,z:0},pivot_HEAD,"y","HEAD");


        pivot_LSH.position.set(3.56,1.85,-0.8);
        pivot_LARM.position.set(1.95,-0.90,1.5);
        pivot_LHND.position.set(0,-4.02,0);
        pivot_LTHT.position.set(2.32,-3.1,-0.79);
        pivot_LUMB.position.set(-0.57,-1.83,1.2);
        pivot_LLEG.position.set(-1.3,-1.53,-1.18);
        pivot_LKNE.position.set(0,-2.6,0);
        pivot_LBMB.position.set(0.15,-3,0);
        pivot_LFOT.position.set(1.18,-1.54,1.3);
        pivot_RSH.position.set(-3.56,1.85,-0.8);
        pivot_RARM.position.set(-1.95,-0.90,1.5);
        pivot_RHND.position.set(0,-4.02,0);
        pivot_RTHT.position.set(-2.32,-3.1,-0.79);
        pivot_RUMB.position.set(0.57,-1.83,1.2);
        pivot_RLEG.position.set(1.3,-1.53,-1.18);
        pivot_RKNE.position.set(0,-2.6,0);
        pivot_RBMB.position.set(-0.15,-3,0);
        pivot_RFOT.position.set(-1.18,-1.54,1.3);
        pivot_HEAD.position.set(0,3.2,-1.1);

        //pivot_LUMB.add(new THREE.AxesHelper(3));
        pivot_RBMB.add(pivot_RFOT);
        pivot_RKNE.add(pivot_RBMB);
        pivot_RLEG.add(pivot_RKNE);
        pivot_RUMB.add(pivot_RLEG);
        pivot_RTHT.add(pivot_RUMB);
        pivot_RARM.add(pivot_RHND);
        pivot_RSH.add(pivot_RARM);
        pivot_LBMB.add(pivot_LFOT);
        pivot_LKNE.add(pivot_LBMB);
        pivot_LLEG.add(pivot_LKNE);
        pivot_LUMB.add(pivot_LLEG);
        pivot_LTHT.add(pivot_LUMB);
        pivot_LARM.add(pivot_LHND);
        pivot_LSH.add(pivot_LARM);
        pivot_Body.add(pivot_HEAD);
        pivot_Body.add(pivot_RTHT);
        pivot_Body.add(pivot_RSH);
        pivot_Body.add(pivot_LSH);
        pivot_Body.add(pivot_LTHT);
        Robot.add(pivot_Body);
        this._Robot = Robot;
        this._scene.add(Robot);
    }

    _setupCamera(){
        const width = this._width;
        const height = this._height;
        const camera = new THREE.PerspectiveCamera(
            60,
            width/height,
            0.01,
            100
        );
        camera.position.y =0;
        camera.position.z =25;
        this._camera = camera;
        this._scene.add(this._camera);
    }
    _setupLights(){
        const color = 0xffffff;
        const intensity = 1.5;
        const light = new THREE.DirectionalLight(color,2);
        light.position.set(0,0,0);
        this._camera.add(light);
        const light2 = new THREE.DirectionalLight(color,intensity);
        light2.position.set(0,60,50);
        /*light2.shadow.mapSize.width = light2.shadow.mapSize.height = 1024;
        light2.shadow.camera.near = 0.5;
        light2.shadow.camera.far = 500;
        light2.shadow.radius = 4;
        light2.shadow.bias = -0.001;
        light2.shadow.camera.top = light2.shadow.camera.right = 15;
        light2.shadow.camera.bottom = light2.shadow.camera.left = -15;
        light2.castShadow = true;*/
        this._scene.add(light2);
        this._scene.background = new THREE.Color(0xFFFFFF);

        const eyelight_l = new THREE.RectAreaLight(0x00FF00,7);
        const eyelight_2 = new THREE.RectAreaLight(0x00FF00,7);
        eyelight_l.lookAt(-1.1,5.2,2);
        eyelight_l.position.set(-1.1,5.2,-0.5);
        eyelight_2.lookAt(1.1,5.2,2);
        eyelight_2.position.set(1.1,5.2,-0.5);
        this._scene.add(eyelight_l);
        this._scene.add(eyelight_2);
    }
    _setupControls(){
        const controls = new OrbitControls(this._camera,this._renderer.domElement);
        this._controls = controls;
        controls.minDistance = 14;
        controls.maxDistance = 30;
        controls.target.set(0,-4,0);
    }
    _initAxis(name){
        const geometry_p = new THREE.RingBufferGeometry(
            1.5,
            2.5,
            32,
            1,
            Math.PI*3/2,
            Math.PI/3);
        const geometry_n = new THREE.RingBufferGeometry(
            1.5,
            2.5,
            32,
            1,
            Math.PI*3/2,
            -Math.PI/3);

        const material_p = new THREE.MeshBasicMaterial;
        material_p.color.set(0x0000FF);
        material_p.transparent = true;
        material_p.opacity = 0.5;
        const material_n = new THREE.MeshBasicMaterial;
        material_n.color.set(0xFF0000);
        material_n.transparent = true;
        material_n.opacity = 0.5;
        material_p.side = THREE.DoubleSide;
        material_n.side = THREE.DoubleSide;
        const mesh = new THREE.Mesh(geometry_p,material_p);
        const mesh2 = new THREE.Mesh(geometry_n,material_n);


        const shape = new THREE.Shape();
        const x = -2.0;
        const y = 0;
        shape.moveTo(x-1,y);
        shape.lineTo(x,y+1.5);
        shape.lineTo(x+1,y);
        const Tringle = new THREE.ShapeGeometry(shape);
        const tm1 = new THREE.Mesh(Tringle,material_n);
        tm1.rotation.z = Math.PI/6;
        const tm2 = new THREE.Mesh(Tringle,material_p);
        tm2.rotation.y = Math.PI;
        tm2.rotation.z = Math.PI/6;
        const helper = new THREE.Object3D();
        helper.add(tm1);
        helper.add(tm2);
        helper.add(mesh);
        helper.add(mesh2);
        helper.rotation.z = Math.PI;
        switch(name){
            case "LSH" :
                helper.rotation.y += Math.PI/2;
                helper.position.x += 2;
                break;
            case "RSH" :
                helper.rotation.y -= Math.PI/2;
                helper.position.x -= 2;
                break;
            case "LLEG":
            case "LKNE":
                helper.rotation.y += Math.PI/2;
                helper.position.x += 4;
                break;
            case "RLEG":
            case "RKNE":
                helper.rotation.y -= Math.PI/2;
                helper.position.x -= 4;
                break;
            case "LBMB":
                helper.rotation.z -= Math.PI;
                helper.rotation.y -= Math.PI/2;
                helper.position.x += 4;
                break;
            case "RBMB":
                helper.rotation.z -= Math.PI;
                helper.rotation.y += Math.PI/2;
                helper.position.x -= 4;
                break;
            case "LARM":
            case "LHND":
            case "RARM":
            case "RHND":
            case "LUMB":
            case "RUMB":
                 helper.position.z += 2;
                 break;
            case "LFOT":
            case "RFOT":
                 helper.rotation.y += Math.PI;
                 //helper.rotation.z -= Math.PI;
                 helper.position.z += 2;
                 break;
            case "LTHT":
            case "RTHT":
                helper.rotation.x += Math.PI/2;
                helper.position.y -=1;
                break;
        }
        return helper
    }
    _render(){
        if(this._rendeready){
            requestAnimationFrame(this._render.bind(this));
            this._controls.update();
        }
        if(this._isready){
            this._renderer.render(this._scene,this._camera);
            if(!this._loadCompleted){
               window.Android.loaded();
               this._rendeready = false;
               this._loadCompleted = true;
            }
        }
    }
    _setupPosition(position){
        if(this._intersected){
            const selected_name = "pivot-"+this._intersected.name;
            const selected_axes = this._intersected.axes;
            this._setPosition(position,selected_name,selected_axes);
        }
    }
    _setPosition(position,selected_name,selected_axes){
            switch(selected_axes){
                case "x":
                    this._Robot.getObjectByName(selected_name).rotation.x = THREE.MathUtils.degToRad(position);
                    break;
                case "-x":
                    this._Robot.getObjectByName(selected_name).rotation.x = -THREE.MathUtils.degToRad(position);
                    break;
                case "y":
                    this._Robot.getObjectByName(selected_name).rotation.y = THREE.MathUtils.degToRad(position);
                    break;
                case "z":
                    this._Robot.getObjectByName(selected_name).rotation.z = -THREE.MathUtils.degToRad(position);
                    break;
                case "-z":
                     this._Robot.getObjectByName(selected_name).rotation.z = THREE.MathUtils.degToRad(position);
                     break;
                default :
                    console.log("axes err")
                    break;
                }
        }
    _onPointerMove(event){
        this._pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this._pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this._touchEvent();
    }

    _sendDatatoAndroid(){
        if(this._intersected){
            const selected_name = "pivot-"+this._intersected.name;
            const motNum = this._arr.indexOf(this._intersected.name);
            const selected_axes = this._intersected.axes;
            window.Android.sendData(motNum);
        }
        else if(this._intersected == null){
            window.Android.sendData(null);
        }
    }
    _touchEvent(){
        this._raycast.setFromCamera(this._pointer,this._camera);
        const intersects = this._raycast.intersectObject(this._Robot);
            if ( intersects.length > 0 ) {
                    if(intersects[0].object.parent.parent.name != "AxesHelper"){
                        const object = intersects[0].object.parent.parent.parent;
                        if((object.name == "body") || (object.name=="HEAD")){
                            if(this._intersected){
                                this._intersected.traverse((child)=>{
                                    if(child.isMesh){
                                        child.material.emissive.setHex(0x000000);
                                    }
                                })
                                this._intersected.traverseAncestors((parent)=>{
                                    if(parent.name.indexOf("pivot")){
                                        parent.traverse((child)=>{
                                            if(child.name == "AxesHelper"){
                                                child.removeFromParent();
                                            }
                                        })
                                    }
                                })
                                this._intersected = null;
                                this._selected = null;
                            }
                        }
                        else{
                            if(this._intersected != object){
                                if(this._intersected){
                                    this._intersected.traverse((child)=>{
                                        if(child.isMesh){
                                            child.material.emissive.setHex(0x000000);
                                        }
                                    })
                                    this._intersected.traverseAncestors((parent)=>{
                                        if(parent.name.indexOf("pivot")){
                                            parent.traverse((child)=>{
                                                if(child.name == "AxesHelper"){
                                                    child.removeFromParent();
                                                }
                                            })
                                        }
                                    })
                                }
                                object.traverse((child)=>{
                                    if(child.isMesh){
                                        child.material.emissive.setHex(0x00FF00);
                                    }
                                })
                                this._intersected = object;
                                const rotationHelper = new THREE.Object3D();
                                if(this._intersected.axes){
                                    rotationHelper.add(this._initAxis(this._intersected.name));
                                }
                                rotationHelper.name = "AxesHelper";
                                object.parent.parent.add(rotationHelper);
                                this._selected = object.parent.parent;
                                this._sendDatatoAndroid();
                            }
                        }
                    }

                } else {
                    if(this._intersected){
                        this._intersected.traverse((child)=>{
                            if(child.isMesh){
                                child.material.emissive.setHex(0x000000);
                            }
                        })
                        this._intersected.traverseAncestors((parent)=>{
                            if(parent.name.indexOf("pivot")){
                                parent.traverse((child)=>{
                                    if(child.name == "AxesHelper"){
                                        child.removeFromParent();
                                    }
                                })
                            }
                        })
                        this._intersected = null;
                        this._selected = null;
                        this._sendDatatoAndroid();
                    }
                }
                this._render();
    }
    _setAngle(arr){
        var i=0;
        for(const obj of this._arr){
            this._Robot.traverse((child)=>{
                if(child.name == "pivot-"+obj){
                    const name = child.name;
                    const axes = child.getObjectByName(obj).axes;
                    this._setPosition(arr[i],name,axes);
                    i++;
                   }
            })
        }
        if(this._intersected){
            this._intersected.traverse((child)=>{
                if(child.isMesh){
                    child.material.emissive.setHex(0x000000);
                }
            })
            this._intersected.traverseAncestors((parent)=>{
                if(parent.name.indexOf("pivot")){
                    parent.traverse((child)=>{
                        if(child.name == "AxesHelper"){
                            child.removeFromParent();
                        }
                    })
                }
            })
            this._intersected = null;
            this._selected = null;
            this._sendDatatoAndroid();
        }
        if(!this._isready){
            this._isready = true;
        }
    }
    _savePhoto(){
            const rd = new THREE.WebGLRenderer({preserveDrawingBuffer:true});
            rd.setSize(500,500);
            const ssCamera = new THREE.PerspectiveCamera(
                75,
                1,
                0.01,
                100
            );
            ssCamera.position.copy(this._controls.object.position);
            ssCamera.lookAt(0,-3,0);
            ssCamera.name = "tempCamera";
            this._scene.add(ssCamera);
            rd.render(this._scene,ssCamera);
            this._scene.remove(this._scene.getObjectByName("tempCamera"));
            rd.domElement.toBlob(function(blob){
              var reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = function(){
                var base64string = reader.result;
                window.Android.getBlob(base64string);
              }

            }, 'image/png', 1.0);
        }

}


window.onload = function(){
    let app = new App();

    window.getData = function(position){ //함수 전역설정 (html 에서 읽어야하므로)
      app._setupPosition(position);
      }
    window.addEventListener('click',(event)=>{
        app._onPointerMove(event);
    });
    window.setAngle = function(arr){
        app._setAngle(arr);
        app._render();
    }
    window.addEventListener('touchstart',()=>{
        app._rendeready = true;
        app._render();
    })
    window.addEventListener('touchend',()=>{
        app._rendeready = false;
        app._render();
    })
    window.startRotating = ()=>{
        app._rendeready = true;
        app._render();
    }
    window.endRotating = ()=>{
        app._rendeready = false;
        app._render();
    }
    window.snapshot = ()=>{
        app._savePhoto();
    }
}



