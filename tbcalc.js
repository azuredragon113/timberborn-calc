
// Input values
let UserValues = {};

// Output stuff
let Output = [];

// Timberborn Calculator
function tbc(e) {
	// Set user value
	UserValues[e.target.id.split('-')[0]] = e.target.value;

	// Get squares from radius
	let harvest;
	if (UserValues.shape == 'square') {
		harvest = harvest_sq(UserValues.radius);
	} else {
		harvest = harvest_circ(UserValues.radius);
	}

	// Get wellbeing values
	let wb = wellbeing(UserValues.wellbeing);

	// Get timing values
	let ts = Timings[UserValues.product];

	// Calculate yield
	// squares * yield
	let yld = harvest[0] * ts[4];

	// Caclculate movement speed (as hrs per square), adjusted for wellbeing
	let trv_ub, trv_b;
	if (ts[7]) { // Aquatic
		// invert / squares-per-second / 20 / move speed
		trv_ub = 1 / Travel.water[0] / Defs.sec_hr / wb[1];
		trv_b = 1 / Travel.water[1] / Defs.sec_hr / wb[1];
	} else { // Land
		trv_ub = 1 / Travel.land[0] / Defs.sec_hr / wb[1];
		trv_b = 1 / Travel.land[1] / Defs.sec_hr / wb[1];
	}

	// Convert harvest seconds to game hours, adjusted for wellbeing
	// harvest seconds / 20 / work speed
	let hvst_hrs = ts[2] / Defs.sec_hr / wb[0];

	// Calculate "beaver hours" required to harvest	
	// squares * harvest time + travel distance * (unburdened + burdened) * trips
	let hvst_bh = harvest[0] * hvst_hrs + harvest[1] * (trv_ub + trv_b) * ts[5];

	// Calculate work days required to harvest for total harvesters
	// beaver hours / work hours / harvesters
	let hvst_days = hvst_bh / UserValues.workhours / UserValues.harvesters;

	// Convert planting seconds to game hours, adjusted for wellbeing
	// plant seconds / 20 / work speed
	let plnt_hrs = ts[0] / Defs.sec_hr / wb[0];

	// Calculate "beaver hours" required to plant
	// squares * (planting time + unburdened travel for one square)
	// **this is a close enough approximation for ideal pathfinding
	let plnt_bh = harvest[0] * (plnt_hrs + trv_ub);

	// Calculate work days required to plant for total planters
	// beaver hours / work hours / planters
	let plnt_days = plnt_bh / UserValues.workhours / UserValues.planters;

	// Make some nice hooman words
	// Note: Growth value is used for planters, regrowth value for harvesters
	Output = [
		yld+' '+ts[6]+' yield',
		hvst_days.toFixed(2)+' days for '+UserValues.harvesters+' harvester'+((UserValues.harvesters==1)? '':'s'),
		((hvst_days < ts[3])? 'S':'Ins')+'ufficient harvesters for the '+ts[3]+'-day regrowth cycle',
		plnt_days.toFixed(2)+' days for '+UserValues.planters+' planter'+((UserValues.planters==1)? '':'s'),
		((plnt_days < ts[1])? 'S':'Ins')+'ufficient planters for the '+ts[1]+'-day growth cycle'
	];

	// Output to hoomans
	document.getElementById('output').innerHTML = '<ol><li>'+Output.join('</li><li>')+'</li></ol>';
}

// Set event listeners / initial input values
let inputs = document.querySelectorAll('input,select');
for (let i=0; i<inputs.length; ++i) {
	inputs[i].addEventListener('change',tbc);
	if (inputs[i].type == 'radio') {
		if (inputs[i].checked) {
			UserValues[inputs[i].id.split('-')[0]] = inputs[i].value;
		}
	} else {
		UserValues[inputs[i].id] = inputs[i].value;
	}
}

// Key definitions
let Defs = {
	//workhours:16,	// Working hours per day
	sec_hr:20,	// Realtime seconds per game hour
};

// Data spreadsheet: Travel times
let Travel = {
	// 0 unburdened, 1 burdened (squares per realtime second)
	land:	[	2.67,	1.33],
	water:	[	2,		1	]
};

// Data spreadsheet: Timings
let Timings = {
	// 0 plant seconds, 1 growth days, 2 harvest seconds,
	// 3 regrowth days, 4 yield amount, 5 trips required, 6 product, 7 aquatic

	// Lumberjacks
	birch:		[	11,	9,	23,	9,	1,	1,	'wood',			false],
	pine:		[	14,	12,	23,	12,	2,	1,	'wood',			false],
	chestwood:	[	14,	24,	23,	24,	4,	2,	'wood',			false],
	maple:		[	21,	28,	40,	28,	6,	3,	'wood',			false],
	oak:		[	21,	30,	48,	30,	8,	4,	'wood',			false],
	mangwood:	[	12,	10,	23,	10,	2,	1,	'wood',			true],

	// Tappers
	pineresin:	[	14,	12,	23,	7,	2,	1,	'pine resin',	false],
	maplesyrup:	[	21,	28,	40,	12,	3,	1,	'maple syrup',	false],

	// Gatherers
	chestnut:	[	14,	24,	20,	8,	3,	1,	'chestnut',		false],
	berry:		[	7.5,12,	15,	12,	3,	1,	'berry',		false],
	dandelion:	[	5,	3,	10,	3,	1,	1,	'dandelion',	false],
	coffee:		[	4,	9,	16,	3,	1,	1,	'coffee bean',	false],
	mangrove:	[	12,	10,	19,	10,	4,	1,	'mangrove fruit', true],

	// Farmers (Folktail)
	carrot:		[	4,	4,	23,	4,	3,	1,	'carrot',		false],
	sunflower:	[	4,	5,	34,	5,	2,	1,	'sunflower',	false],
	potato:		[	4,	6,	23,	6,	1,	1,	'potato',		false],
	wheat:		[	4,	10,	23,	10,	3,	1,	'wheat',		false],
	spadderdock:[	8,	12,	23,	12,	3,	1,	'spadderdock',	true],
	cattail:	[	4,	8,	23,	8,	3,	1,	'cattail',		true],

	// Farmers (Ironteeth)
	kohlrabi:	[	4,	3,	23,	3,	2,	1,	'kohlrabi',		false],
	cassava:	[	4,	5,	23,	5,	1,	1,	'cassava',		false],
	soybean:	[	4,	8,	23,	8,	2,	1,	'soybean',		false],
	canola:		[	4,	9,	23,	9,	3,	1,	'canola seed',	false],
	corn:		[	4,	10,	23,	10,	2,	1,	'corn',			false],
	eggplant:	[	4,	12,	23,	12,	3,	1,	'eggplant',		false],

	// Metal
	scrapmetal:	[	0,	0,	34,	0,	1,	1,	'scrap metal',	false],

	// Miscellaneous
	builder:	[	0,	0,	20,	0,	0,	0,	'builder',		false]
};

// Data spreadsheet: Bot condition
let Condition = {
	// 0 work speed, 1 move speed
	0:	[	1.45,	1.3],
	1:	[	1.9,	1.6],
	2:	[	2.2,	1.9]
};

// Calculator: Wellbeing
function wellbeing(wb) {
	// Work speed
	let wkspd;
	wb *= 1;
	if (wb >= 55) wkspd = 2.5;
	else if (wb < 0) wkspd = 1; // [TODO]
	else {
		let wkspd_scale = [1,1.1,1.2,1.4,1.6,1.8,2,2.1,2.2,2.3,2.4];
		wkspd = wkspd_scale[Math.floor(wb/5)];
	}

	// Movement speed
	let mvspd;
	if (wb >= 52) mvspd = 1.6;
	else if (wb < 0) mvspd = 1; // [TODO]
	else {
		let mvspd_scale = [1,1.05,1.15,1.3,1.4,1.5];
		mvspd = mvspd_scale[Math.floor((wb+8)/10)];
	}

	// 0 work speed, 1 move speed
	return [wkspd, mvspd];
}

// Calculator: Harvest circles
function harvest_circ(r) {
	let dist = 0, sqs = 0;
	for (let i=0; i<=r; ++i) {
		for (let j=1; j<=r; ++j) {
			tmp_dist = Math.sqrt(i*i+j*j);
			if (tmp_dist <= r) {
				++sqs;
				dist += tmp_dist;
			}
		}
	}

	// 0 total squares, 1 total distances
	return [sqs*4, dist*4];
}

// Calculator: Harvest squares
function harvest_sq(r) {
	let dist = 0;
	for (let i=0; i<r; ++i) {
		for (let j=0; j<r; ++j) {
			dist += Math.sqrt(i*i+j*j);
		}
	}

	// 0 total squares, 1 total distance
	return [r*r-1, dist];
}

// Trigger
document.getElementById('product').dispatchEvent(new Event('change'));
