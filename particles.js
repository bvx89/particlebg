var Particles = (function () {
	// DOM
	var ctx,
	
	// Engine
		meter,
		now,
		dt   = 0,
		last,
		step = 1/60,
	
	// Properties
		maxSpeed = 50,
		maxAmount = 50,
		maxSize = 1,
		randomization = 20;
		width = window.innerWidth,
		height = window.innerHeight;

	var init = function() {	
		// Set up canvas context
		ctx = document.getCSSCanvasContext('2d', 'background', 
											   width, height);		
											  											   
		// Generate all initial particles
		particles = genParticles(maxAmount, width, height);

		last = timestamp();
	},
	
	timestamp = function() {
	  return window.performance && window.performance.now ? 
			window.performance.now() : 
			new Date().getTime();
	},
	
	animate = function() {
		now = timestamp();
		dt = dt + Math.min(1, (now - last) / 1000);
		while(dt > step) {
			dt -= step;
			update(step);
		}

		render(dt);
		last = now;
		requestAnimFrame(animate);
	},
	
	update = function(dt) {
		var p;
		for (var i = particles.length - 1; i >= 0; i--) {
			p = particles[i];
			
			// Add randomness
			if (Math.random() < 0.01) {
				var vx = addRandom(randomization),
					vy = addRandom(randomization);
				
				if (p.vx + vx > maxSpeed) {
					p.vx = maxSpeed;
				} else if (p.vx < -maxSpeed) {
					p.vx = -maxSpeed;
				} else {
					p.vx += vx;
				}				
					
				if (p.vy + vy > maxSpeed) {
					p.vy = maxSpeed;
				} else if (p.vy < -maxSpeed) {
					p.vy = -maxSpeed;
				} else {
					p.vy += vy;
				}
			}
			
			// Add speed
			p.x += p.vx * dt;
			p.y += p.vy * dt;
			
			// Opposite direction if out of bounds
			if (p.x + p.r > width || p.x - p.r < 0) {
				p.vx *= -1;
			} else if (p.y + p.r > height || p.y - p.r < 0) {
				p.vy *= -1;
			}
		}
	},
	
	render = function(dt) {
		// Draw BG
		ctx.clearRect(0,0,width, height);
		
		// Draw particles
		ctx.fillStyle = '#FCF6CF';
		var p;
		for (var i = particles.length - 1; i >= 0; i--) {
			p = particles[i];
			
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fill();
		}
	},
	
	genParticles = function(amount) {
		var arr = [];
		for (var i = amount - 1; i >= 0; i--) {
			var p = {
					x : Math.random() * width,
					y : Math.random() * height,
					vx : addRandom(maxSpeed),
					vy : addRandom(maxSpeed),
					r : Math.random() * maxSize + 1
					};
			arr.push(p);
		}

		return arr;
	},
	
	addRandom = function(val) {
		return (Math.random() * val - (val/2));
	}

	return {
		begin : function() {
			init();
			requestAnimFrame(animate);
			
			
		}
	}
})();