var Particles = (function () {
	// DOM
	var ctx,
		background,
	
	// Engine
		meter,
		now,
		dt   = 0,
		last,
		step = 1/60,
	
	// Properties
		maxSpeed = 7,
		maxAmount = 60,
		maxSize = 1.5,
		randomization = 0.1;
		width = window.innerWidth,
		height = window.innerHeight;

	var init = function() {	
		// Set up canvas context
		ctx = document.getCSSCanvasContext('2d', 'background', 
											   width, height);		
											   
		background = getBackgroundGradient();
											   
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
			
			// Opposite direction if out of bounds
			if (p.x + p.r > width || p.x - p.r < 0) {
				p.vx *= -1;
			} else if (p.y + p.r > height || p.y - p.r < 0) {
				p.vy *= -1;
			}
			
			// Add speed
			p.x += p.vx * dt + addRandom(randomization);
			p.y += p.vy * dt + addRandom(randomization);
		}
	},
	
	render = function(dt) {
		// Draw BG
		ctx.save();
		ctx.fillStyle = background;
		ctx.fillRect(0,0,width,height);		
		ctx.restore();
		
		
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
					vx : maxSpeed * addRandom(maxSpeed),
					vy : maxSpeed * addRandom(maxSpeed),
					r : Math.random() * maxSize + 1
					};
			arr.push(p);
		}

		return arr;
	},
	
	addRandom = function(val) {
		return (Math.random() * val - (val/2));
	},
	
	getBackgroundGradient = function() {
		// Create gradient
		var grd = ctx.createLinearGradient(0, 0, 0, height);

		// Add colors
		grd.addColorStop(0.000, 'rgba(234, 100, 100, 1.000)');
		grd.addColorStop(0.500, 'rgba(237, 111, 111, 1.000)');
		grd.addColorStop(1.000, 'rgba(244, 39, 39, 1.000)');

		// Fill with gradient
		return grd;
	};

	return {
		begin : function() {
			init();
			requestAnimFrame(animate);
			
			window.onresize = function(event) {
				width = window.innerWidth,
				height = window.innerHeight;
				background = getBackgroundGradient();
			}
		}
	}
})();