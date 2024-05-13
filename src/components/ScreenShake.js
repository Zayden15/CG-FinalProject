import * as THREE from 'three'

function ScreenShake() {

	return {

		// When a function outside ScreenShake handle the camera, it should
		// always check that ScreenShake.enabled is false before.
		enabled: false,

		_timestampStart: undefined,

		_timestampEnd: undefined,

		_startPoint: undefined,

		_endPoint: undefined,
		snowEnabled: false, 

		// update(camera) must be called in the loop function of the renderer,
		// it will re-position the camera according to the requested shaking.
		update: function update(camera) {
			if ( this.enabled == true ) {
				const now = Date.now();
				if ( this._timestampEnd > now ) {
					let interval = (Date.now() - this._timestampStart) / 
						(this._timestampEnd - this._timestampStart) ;
					this.computePosition( camera, interval );
				} else {
					camera.position.copy(this._startPoint);
					this.enabled = false;
					this.snowEnabled = true;
				};
			};
		},



		// This initialize the values of the shaking.
		// vecToAdd param is the offset of the camera position at the climax of its wave.
		shake: function shake(camera, vecToAdd, milliseconds) {
			this.enabled = true ;
			this.snowEnabled = false;
			this._timestampStart = Date.now();
			this._timestampEnd = this._timestampStart + milliseconds;
			this._startPoint = new THREE.Vector3().copy(camera.position);
			this._endPoint = new THREE.Vector3().addVectors( camera.position, vecToAdd );
		},




		computePosition: function computePosition(camera, interval) {
            let position = 0;
            // Damped shake effect
            if (interval < 1) {
                position = Math.sin(interval * Math.PI * 8) * Math.exp(-interval * 6);
            }
            camera.position.lerpVectors(this._startPoint, this._endPoint, position);
        },

		// This is a quadratic function that return 0 at first, then return 0.5 when t=0.5,
		// then return 0 when t=1 ;
		getQuadra: function getQuadra(t) {
			return 9.436896e-16 + (4*t) - (4*(t*t)) ;
		}

	};

};

export default ScreenShake;
