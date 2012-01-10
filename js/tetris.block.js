
Tetris.Block = {};

/**
* Shapes are fitted in minimal number of arrays, in one Z-axis-aligned slice
*/
Tetris.Block.shapes = [
	[
		[1,1],
		[0,1],
		[0,1]
	],
	[
		[1,1,1,1]
	],
	[
		[1,1],
		[1,1]
	],
	[
		[1,0],
		[1,1],
		[1,0]
	],
	[
		[1,0],
		[1,1],
		[0,1]
	]
];

Tetris.Block.position = {};
Tetris.Block.rotation = {};

Tetris.Block.generate = function() {
	var geometry, tmpGeometry;
	
	var type = Math.floor(Math.random()*(Tetris.Block.shapes.length));
	var shape = Tetris.Block.shapes[type];
	console.log(type, shape, shape.length, shape[0].length);
	
	for(var y = 0 ; y < shape.length; y++) {
		for(var x = 0 ; x < shape[0].length; x++) {
			if(shape[y][x] == 0) continue;
			
			if(!geometry) {
				geometry = new THREE.CubeGeometry( Tetris.blockSize, Tetris.blockSize, Tetris.blockSize);
			} else {
				tmpGeometry = new THREE.Mesh(new THREE.CubeGeometry( Tetris.blockSize, Tetris.blockSize, Tetris.blockSize));
				tmpGeometry.position.x = Tetris.blockSize * x;
				tmpGeometry.position.y = Tetris.blockSize * y;
				THREE.GeometryUtils.merge(geometry, tmpGeometry);
			}
		}
	}

	Tetris.Block.mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [
		new THREE.MeshBasicMaterial({color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true}),
		new THREE.MeshBasicMaterial({color: 0xff0000}) 
	]);
	
	// initial position
	Tetris.Block.mesh.position.x = (4 - Tetris.boundingBoxConfig.splitX/2)*Tetris.blockSize + Tetris.blockSize/2;
	Tetris.Block.position.x = 4;
	Tetris.Block.mesh.position.y = (4 - Tetris.boundingBoxConfig.splitY/2)*Tetris.blockSize + Tetris.blockSize/2;
	Tetris.Block.position.y = 4;
	Tetris.Block.mesh.position.z = (15 - Tetris.boundingBoxConfig.splitZ/2)*Tetris.blockSize + Tetris.blockSize/2;
	Tetris.Block.mesh.overdraw = true;
	
	Tetris.scene.add(Tetris.Block.mesh);		
}

Tetris.Block.stepForward = function() {
	Tetris.Block.mesh.position.z -= Tetris.blockSize;
	
	// return hit the bottom
}

Tetris.Block.move = function(x,y) {
	Tetris.Block.mesh.position.x += x;
	Tetris.Block.position.x += x>0?1:-1;
	Tetris.Block.mesh.position.y += y;
	Tetris.Block.position.y += y>0?1:-1;
}

/**
* call when hits the floor and should be transformed to static blocks
*/
Tetris.Block.petrify = function() {

}

Tetris.Block.hitBottom = function() {
	this.petrify();
	
	Tetris.scene.removeObject(Tetris.Block.mesh);
	Tetris.Block.generate();
}