'use strict';

if(typeof require === 'function'){
  var THREE = require('three');
  var THREEx = require('threex.domevents')(THREE);
  var OrbitControls = require('three-orbit-controls')(THREE);
}

function MddfViewer(element){
  this._objects = [];
  this._scene = new THREE.Scene();
  this._camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000000 );
  this._camera.position.z = 5;

  this._controls = new OrbitControls(this._camera);
  this._renderer = new THREE.WebGLRenderer();
  var ambientLight = new THREE.AmbientLight(0x404040);
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  directionalLight.position.set(0, 1, 1);

  this._scene.add(ambientLight);
  this._scene.add(directionalLight);

  this._renderer.setClearColor( 0xffffff, 0 );
  this._renderer.setSize( window.innerWidth, window.innerHeight );
  this._renderer.domElement.style.width='100%';
  this._renderer.domElement.style.height='100%';

  element.appendChild(this._renderer.domElement);

  this._domEvents = new THREEx.DomEvents(this._camera, this._renderer.domElement);

  this._text = document.createElement('div');
  this._text.style.position = 'absolute';
  this._text.style.width = '200px';
  this._text.style.height = '200px';
  this._text.style.top = '20px';
  this._text.style.right = '20px';
  this._text.style.backgroundColor = 'lightgrey';
  this._text.style.color = 'black';
  element.appendChild(this._text);

  this.render();
}

MddfViewer.prototype.buildScene = function buildScene(mddf){
  var self = this;
  var point = [self._camera.position.x, self._camera.position.y, self._camera.position.z];
  mddf.nn(point, function(err, nearest){
    point = nearest;
    self._camera.position.set(point[0], point[1], point[2]-10);
    self._controls.target.set(point[0], point[1], point[2]);

    mddf.rnn(10000000, point, function (err, res) {
      res.forEach(function(found){
        var material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        material.side = THREE.DoubleSide;
        var segments = 1;
        var size = 1;

        var geometry = new THREE.PlaneGeometry(size, size, segments, segments);
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(found.point[0], found.point[1], found.point[2]);
        self._scene.add(mesh);
        self._objects.push(mesh);
        self._domEvents.addEventListener(mesh, 'click', function(){
          self._text.innerHTML = String.fromCharCode.apply(null, found.data);
        }, false);
      });
    });
  });
};

MddfViewer.prototype.render = function render(){
  var self = this;

  this._objects.forEach(function(obj){
    obj.lookAt(self._camera.position);
  });
  this._renderer.render(this._scene, this._camera);
  requestAnimationFrame(this.render.bind(this));
};

if(module && module.exports){
  module.exports = MddfViewer;
}
