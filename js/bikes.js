/*
 * RideFinder sample catalog — maintained by Volt Studios.
 * Numbers are APPROXIMATE reference figures, not live dealer prices/specifications.
 * Update product details and retailer coverage before relying on them commercially.
 * roadStatus: 'offroad', 'pedal', or 'motorcycle'. None guarantee public-road legality.
 */
(function () {
  'use strict';
  const retailers = {
    luna: { name: 'Luna Cycle', url: 'https://lunacycle.com/e-motos/', label: 'Browse Luna Cycle' },
    ronster: { name: 'Ronster Rides', url: 'https://ronsterrides.com/collections/e-moto', label: 'Browse Ronster Rides' }
  };
  const official = {
    talaria: 'https://www.talaria.cn/',
    surron: 'https://www.sur-ron.com/',
    eride: 'https://www.eridepro.com/',
    super73: 'https://super73.com/',
    ride1up: 'https://ride1up.com/',
    zero: 'https://zeromotorcycles.com/',
    stark: 'https://www.starkfuture.com/',
    electro: 'https://electroandcompany.com/'
  };
  const catalog = [];
  function add(brand, model, price, peakKW, size, kind, terrains, level, description, sellers = [], homepage = '', roadStatus = 'offroad') {
    const id = (brand + '-' + model).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    catalog.push(Object.freeze({ id, brand, model, price, peakKW, size, kind, terrains, level, description, sellers, homepage, roadStatus }));
  }
  // Talaria: X3/XXX is the same family in some markets; configurations differ.
  add('Talaria','X3 Pro',3750,9,'compact','emoto',['trail','mixed','paved'],1,'Compact chassis, capable power and a huge custom scene.',['luna','ronster'],official.talaria);
  add('Talaria','XXX',3550,6,'compact','emoto',['trail','mixed','paved'],1,'Light, playful and easy to customize for mixed riding.',['luna'],official.talaria);
  add('Talaria','Sting MX3',3700,6,'mid','emoto',['trail','mixed','paved'],1,'An approachable trail-focused classic with aftermarket support.',[],official.talaria);
  add('Talaria','Sting R MX4',4500,8,'mid','emoto',['trail','mixed','paved'],2,'Proven mid-size platform that balances versatility and control.',[],official.talaria);
  add('Talaria','Sting Pro MX5',5000,13,'mid','emoto',['trail','mixed','paved'],2,'High-output Sting platform for more experienced riders.',[],official.talaria);
  add('Talaria','Komodo',5990,32,'full','emoto',['trail','track','mixed'],3,'Full-size, high-output trail and track machine.',['luna','ronster'],official.talaria);
  // Sur-Ron
  add('Sur-Ron','Light Bee S',2900,3,'compact','emoto',['trail','mixed','paved'],1,'A smaller, lighter platform for mellow off-road riding.',[],official.surron);
  add('Sur-Ron','Light Bee X',4600,8,'mid','emoto',['trail','mixed','paved'],2,'The well-known lightweight electric trail-bike platform.',['luna'],official.surron);
  add('Sur-Ron','Hyper Bee',3400,5,'compact','pit',['trail','mixed'],1,'Compact pit-bike form with playful dirt capability.',[],official.surron);
  add('Sur-Ron','Ultra Bee',6500,21,'full','emoto',['trail','track','mixed'],3,'Step-up off-road geometry, suspension and power.',[],official.surron);
  add('Sur-Ron','Storm Bee',8500,22,'full','motorcycle',['trail','track'],3,'Larger off-road motorcycle platform with serious heft.',[],official.surron);
  // E Ride Pro; the 2026 manufacturer lineup may differ from earlier generations.
  add('E Ride Pro','S',3999,6,'compact','emoto',['trail','mixed','paved'],1,'Compact and versatile, with a familiar e-moto layout.',['ronster'],official.eride);
  add('E Ride Pro','SS 2.0',4299,12,'mid','emoto',['trail','mixed','paved'],2,'Balanced performance and strong upgrade potential.',['luna'],official.eride);
  add('E Ride Pro','SS 3.0',4699,15.8,'mid','emoto',['trail','mixed','paved'],2,'Sporty mid-size bike with stronger performance.',['luna'],official.eride);
  add('E Ride Pro','SR',5199,25,'mid','emoto',['trail','track','mixed'],3,'Aggressive power delivery for experienced riders.',['ronster'],official.eride);
  add('E Ride Pro','Pro 4.0',4999,18,'mid','emoto',['trail','mixed','paved'],3,'Updated high-performance e-moto platform.',['luna','ronster'],official.eride);
  add('E Ride Pro','Mini R',3599,8,'compact','pit',['trail','mixed'],1,'A compact electric dirt bike for shorter reach.',['luna'],official.eride);
  // Other off-road options.
  add('79bike','Falcon Pro',4500,13,'mid','emoto',['trail','mixed','paved'],2,'A customizable lightweight e-moto alternative.');
  add('79bike','Falcon M',3900,10,'compact','emoto',['trail','mixed','paved'],2,'Compact design with lively off-road performance.');
  add('Rawrr','Mantis X',3000,7,'mid','emoto',['trail','mixed','paved'],1,'Budget-conscious, mid-size dirt-focused option.');
  add('Rawrr','Mantis',5000,12,'full','emoto',['trail','mixed','paved'],2,'A larger chassis with capable trail-oriented setup.');
  add('Segway','X160',2900,3,'compact','emoto',['trail','mixed','paved'],1,'Smaller legacy Segway dirt-bike platform; check used availability.');
  add('Segway','X260',4500,5,'mid','emoto',['trail','mixed','paved'],2,'Legacy light e-moto platform; mostly a used-market find.');
  add('Stark','VARG MX',12900,60,'full','motorcycle',['track','trail'],3,'Competition-focused full-size electric motocross. ',[],official.stark);
  add('Stark','VARG EX',13900,60,'full','motorcycle',['trail','track','mixed'],3,'High-performance enduro platform; road approval depends on variant and market.',[],official.stark);
  add('Electro & Co','ETM RTR Lite',1799,4,'compact','pit',['trail','mixed'],1,'Mini electric dirt platform for a smaller budget.',['luna'],official.electro);
  add('Electro & Co','ETM RTR Sport',2999,10,'compact','pit',['trail','mixed'],2,'Extra performance in a compact pit-bike package.',['luna'],official.electro);
  // Pedal e-bikes and registered electric motorcycles are different vehicle classes.
  add('SUPER73','R Adventure',3995,0.75,'mid','pedal',['paved','mixed'],1,'Pedal-equipped, pavement-focused adventure-styled e-bike.',[],official.super73,'pedal');
  add('Ride1Up','Revv 1',2395,0.75,'mid','pedal',['paved','mixed'],1,'Moped-style pedal e-bike built around paved cruising.',[],official.ride1up,'pedal');
  add('Zero','FXE',12495,34,'full','motorcycle',['paved','mixed'],3,'Street-oriented electric motorcycle; licensing and registration apply.',[],official.zero,'motorcycle');
  window.RF_DATA = Object.freeze({ bikes: Object.freeze(catalog), retailers: Object.freeze(retailers) });
})();
