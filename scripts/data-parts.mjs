// Part types for the catalogue generator.
// [slug, name, description, icon]
export const CATEGORIES = [
  ["engines", "Engines & Engine Parts", "Complete engines, cylinder heads, blocks, timing, lubrication and engine management components.", "engine"],
  ["turbo-performance", "Turbo & Induction", "Turbochargers, superchargers, intercoolers, manifolds and throttle bodies.", "turbo"],
  ["transmission", "Transmission & Drivetrain", "Gearboxes, mechatronics, torque converters, transfer cases, differentials and driveshafts.", "gearbox"],
  ["suspension", "Suspension & Steering", "Air suspension, shock absorbers, control arms, subframes, steering racks and hubs.", "strut"],
  ["brakes", "Brakes", "Brake discs, pads, calipers, ABS and stability control units.", "disc"],
  ["body-parts", "Body & Exterior", "Bumpers, hoods, fenders, doors, tailgates, grilles, mirrors and body kits.", "bumper"],
  ["lighting", "Lighting", "LED, laser and matrix headlights, tail lights, fog lights and lighting control modules.", "headlight"],
  ["cooling", "Cooling & Climate", "Radiators, fans, water pumps, thermostats, condensers and A/C compressors.", "radiator"],
  ["electrical", "Electrical & Electronics", "Control units, sensors, cameras, clusters, infotainment, alternators and starters.", "ecu"],
  ["interior", "Interior", "Dashboards, seats, steering wheels, consoles, door cards and trim.", "dashboard"],
  ["fuel-exhaust", "Fuel & Exhaust", "Injectors, fuel pumps, tanks, exhaust systems, catalytic converters and particulate filters.", "exhaust"],
  ["wheels", "Wheels", "Alloy wheel sets and wheel hardware.", "wheel"],
];

// scope: v = per vehicle generation, e = per engine, g = per gearbox
// tier: 1 = every vehicle, 2 = std and deep, 3 = deep only
// req (vehicle): air awd ev noev no2door suvvan  |  req (engine): turbo sc boosted diesel petrol  |  req (gearbox): auto dct
// pop: 2 = most requested, 1 = often requested, 0 = standard
// cond: conditions normally offered. N new, U used and tested, R remanufactured
const P = [];
const t = (scope, cat, rows) => rows.forEach(([s, n, i, tier, req, pop, cond, d, opt]) => P.push({ s, n, c: cat, i, scope, tier, req, pop, cond, d, ...(opt || {}) }));

t("e", "engines", [
  ["complete-engine", "Complete Engine", "engine", 1, "", 2, "UR", "Complete engine supplied as a tested used unit or a remanufactured unit, depending on availability. Ancillaries such as the turbocharger, injectors and alternator are confirmed item by item in the quotation, so you know what is fitted and what you need to transfer from the old engine."],
  ["short-block", "Short Block", "engine", 2, "", 0, "NR", "Engine block assembled with crankshaft, connecting rods and pistons. A practical route when the bottom end is damaged and the cylinder head and ancillaries from the original engine can be reused."],
  ["cylinder-head", "Cylinder Head", "cylinder-head", 1, "", 2, "NUR", "Cylinder head supplied bare or complete with valves and camshafts. Heads are pressure tested and checked for flatness before dispatch. Tell us whether you need the head bare, assembled, or with camshafts and carriers."],
  ["crankshaft", "Crankshaft", "crankshaft", 2, "", 0, "NU", "Crankshaft supplied with journals measured against specification. Bearing shells can be quoted with the shaft in the correct size grade."],
  ["piston-ring-set", "Piston & Ring Set", "piston", 2, "", 0, "N", "Full set of pistons with rings and gudgeon pins for one engine. Bore size class and compression ratio differ between engine variants, so the engine number is needed to quote."],
  ["camshaft-set", "Camshaft Set", "crankshaft", 2, "", 0, "NU", "Inlet and exhaust camshafts for one cylinder bank or the complete engine. Supplied with or without adjusters, as you require."],
  ["timing-chain-kit", "Timing Chain Kit", "timing", 1, "", 1, "N", "Timing chain kit with chains, guides, tensioners and sprockets. Kits are matched to the engine number because guide and tensioner designs were revised during production."],
  ["head-gasket-set", "Head Gasket Set", "gasket", 1, "", 0, "N", "Top-end gasket set including the cylinder head gasket, head bolts where specified, valve stem seals and the manifold and cover gaskets needed for a head removal."],
  ["oil-pump", "Oil Pump", "pump", 1, "", 0, "N", "Engine oil pump, supplied with drive chain or balance shaft module where the design combines them."],
  ["oil-filter-housing", "Oil Filter Housing & Cooler", "pump", 1, "", 1, "N", "Oil filter housing with oil cooler and seals. A common source of oil and coolant leaks on modern engines and frequently replaced as one assembly."],
  ["oil-pan", "Oil Pan / Sump", "gasket", 2, "", 0, "NU", "Engine oil pan with drain plug. Supplied with gasket or sealant and, where fitted, the oil level sensor quoted separately."],
  ["valve-cover", "Valve Cover", "gasket", 1, "", 1, "N", "Valve cover with integrated crankcase breather and gasket. On many modern engines the breather membrane is part of the cover, so the cover is replaced as a unit."],
  ["engine-mount-set", "Engine Mount Set", "mount", 2, "", 0, "N", "Left and right engine mounts. Active or hydraulic mounts are matched to the vehicle specification."],
  ["camshaft-adjuster", "Camshaft Adjuster (VVT) Unit", "timing", 2, "petrol", 0, "N", "Variable valve timing adjuster units for the inlet and exhaust camshafts, supplied with central bolts or solenoids where they are part of the repair."],
  ["engine-wiring-harness", "Engine Wiring Harness", "wiring", 2, "", 0, "NU", "Engine wiring harness. Harness part numbers are tied closely to model year and options, so a VIN is required before quoting."],
  ["engine-ecu", "Engine Control Unit (ECU)", "ecu", 1, "", 2, "NU", "Engine control unit. Control units are matched by hardware and software number and normally need coding or adaptation to the vehicle after fitting. Send the numbers printed on your original unit together with the VIN."],
]);
t("e", "turbo-performance", [
  ["turbocharger", "Turbocharger", "turbo", 1, "turbo", 2, "NUR", "Turbocharger supplied new, remanufactured or as a tested used unit. Twin-turbo engines are quoted per turbocharger or as a pair. Oil feed and return lines and gaskets can be added to the quotation."],
  ["supercharger", "Supercharger", "turbo", 1, "sc", 1, "NUR", "Supercharger assembly. Supplied with or without the charge cooler, depending on the engine design and what you need replaced."],
  ["intercooler", "Intercooler", "radiator", 1, "boosted", 0, "N", "Charge air cooler. Air-to-air and water-to-air designs are both used across this engine family, so the vehicle model is confirmed before quoting."],
  ["intake-manifold", "Intake Manifold", "manifold", 1, "", 1, "NU", "Intake manifold, supplied with flap actuators and sensors where they are part of the assembly."],
  ["exhaust-manifold", "Exhaust Manifold", "manifold", 2, "", 0, "NU", "Exhaust manifold with gaskets and fixings. On engines where the manifold and turbocharger are one casting, the two are quoted together."],
  ["throttle-body", "Throttle Body", "throttle", 2, "", 0, "NU", "Electronic throttle body with gasket."],
  ["egr-valve-cooler", "EGR Valve & Cooler", "manifold", 1, "diesel", 1, "N", "Exhaust gas recirculation valve and cooler. Quoted as separate items or as an assembly, depending on the engine design."],
]);
t("e", "fuel-exhaust", [
  ["fuel-injector-set", "Fuel Injector Set", "injector", 1, "", 2, "NR", "Set of fuel injectors for one engine. Injectors are matched by part number and, where the manufacturer uses them, by classification code. Single injectors can also be quoted."],
  ["high-pressure-fuel-pump", "High-Pressure Fuel Pump", "pump", 1, "", 1, "N", "High-pressure fuel pump for direct or common-rail injection, supplied with seal and follower where applicable."],
  ["dpf", "Diesel Particulate Filter (DPF)", "exhaust", 2, "diesel", 1, "N", "Diesel particulate filter. Emissions parts are specific to the market and emissions standard of the vehicle, so the VIN is required."],
]);
t("e", "cooling", [
  ["water-pump", "Water Pump", "pump", 1, "", 2, "N", "Coolant pump, mechanical or electric according to the engine design, supplied with gasket and fixings where needed."],
  ["thermostat-housing", "Thermostat Housing", "pump", 1, "", 1, "N", "Thermostat with housing and seals. Map-controlled thermostats include the electrical connector and are matched to the engine variant."],
  ["ac-compressor", "A/C Compressor", "alternator", 1, "", 1, "NU", "Air-conditioning compressor with clutch or control valve. The refrigerant type and pulley design are confirmed against the vehicle."],
]);
t("e", "electrical", [
  ["alternator", "Alternator", "alternator", 1, "", 1, "NR", "Alternator matched by output rating and connector. Vehicles with 48V systems use a starter-generator, which is quoted separately on request."],
  ["starter-motor", "Starter Motor", "alternator", 1, "", 1, "NR", "Starter motor matched to the engine and gearbox combination."],
  ["ignition-coil-set", "Ignition Coil Set", "injector", 2, "petrol", 0, "N", "Set of ignition coils for one engine. Spark plugs can be added to the same quotation."],
]);

t("g", "transmission", [
  ["gearbox", "Gearbox", "gearbox", 1, "", 2, "UR", "Complete transmission supplied as a tested used unit or a remanufactured unit. The gearbox code on the type plate must match, because the same family is built in many ratio and torque variants."],
  ["mechatronic-unit", "Mechatronic Unit / Valve Body", "ecu", 1, "", 2, "NUR", "Mechatronic unit or valve body with control module. These units usually need coding or adaptation after fitting. Send the numbers from your original unit."],
  ["torque-converter", "Torque Converter", "disc", 1, "auto", 1, "NR", "Torque converter matched to the gearbox code and engine."],
  ["clutch-pack", "Dual Clutch Pack", "disc", 1, "dct", 1, "N", "Dual clutch assembly for the gearbox, supplied with the fitting parts specified by the manufacturer."],
  ["service-kit", "Oil Pan, Filter & Service Kit", "gasket", 1, "", 0, "N", "Service kit with oil pan or filter, seals and the correct quantity of transmission fluid for the gearbox."],
]);

t("v", "transmission", [
  ["transfer-case", "Transfer Case", "differential", 2, "awd noev", 2, "NUR", "Transfer case for all-wheel-drive models. Ratio and actuator design are confirmed against the VIN."],
  ["front-differential", "Front Differential", "differential", 2, "awd noev", 1, "NU", "Front axle differential. The ratio must match the rear axle, so we confirm it from the VIN or the label on your unit."],
  ["rear-differential", "Rear Differential", "differential", 2, "noev", 1, "NU", "Rear axle differential. Open, locking and electronically controlled units are all used in this model range and are matched by ratio and part number."],
  ["propshaft", "Propshaft", "driveshaft", 2, "noev", 0, "NU", "Propeller shaft with center bearing and joints. Length differs with engine, gearbox and wheelbase."],
  ["front-driveshaft", "Front Driveshaft (CV Axle)", "driveshaft", 2, "awd", 0, "NU", "Front driveshaft with inner and outer constant-velocity joints. Left and right shafts are quoted individually."],
  ["rear-driveshaft", "Rear Driveshaft (CV Axle)", "driveshaft", 3, "", 0, "NU", "Rear driveshaft with constant-velocity joints. Left and right shafts are quoted individually."],
  ["drive-unit", "Electric Drive Unit", "motor", 1, "ev", 2, "UR", "Electric drive unit with motor, inverter and reduction gear. Front and rear units differ, and the part number must match the vehicle configuration."],
]);
t("v", "suspension", [
  ["front-air-strut", "Front Air Strut", "strut", 1, "air", 2, "NUR", "Front air suspension strut. Left and right units are quoted individually or as a pair. Versions with and without adaptive damping are not interchangeable."],
  ["rear-air-spring", "Rear Air Spring", "airspring", 1, "air", 2, "NU", "Rear air spring or air strut. Left and right units are quoted individually or as a pair."],
  ["air-suspension-compressor", "Air Suspension Compressor", "compressor", 1, "air", 2, "NU", "Air suspension compressor, normally supplied with relay. A compressor that runs constantly usually points to a leak elsewhere, so we recommend checking the struts and valve block at the same time."],
  ["air-suspension-valve-block", "Air Suspension Valve Block", "compressor", 2, "air", 1, "N", "Valve block that distributes air to each corner of the suspension."],
  ["front-shock-absorber", "Front Shock Absorber", "strut", 1, "", 1, "NU", "Front shock absorber. Passive and electronically controlled dampers are both used in this model range. Quoted individually or as a pair."],
  ["rear-shock-absorber", "Rear Shock Absorber", "strut", 1, "", 1, "NU", "Rear shock absorber. Quoted individually or as a pair."],
  ["front-control-arm-set", "Front Control Arm Set", "controlarm", 1, "", 1, "N", "Front suspension control arms with bushes and ball joints, supplied individually or as a full axle set."],
  ["rear-control-arm-set", "Rear Control Arm Set", "controlarm", 3, "", 0, "N", "Rear suspension links and control arms with bushes, supplied individually or as an axle set."],
  ["front-subframe", "Front Subframe", "subframe", 2, "", 1, "NU", "Front axle subframe. Often needed after impact damage. Engine and drive variant are confirmed before quoting."],
  ["rear-subframe", "Rear Subframe", "subframe", 3, "", 0, "NU", "Rear axle subframe, supplied bare unless a complete axle is requested."],
  ["steering-rack", "Steering Rack", "rack", 1, "", 2, "NUR", "Steering rack. Electric racks carry their own control unit and usually need coding to the vehicle. Rear-wheel-steering and active-steering versions are separate part numbers."],
  ["steering-column", "Steering Column", "rack", 3, "", 0, "NU", "Steering column with adjustment motors where fitted."],
  ["steering-knuckle", "Steering Knuckle", "hub", 2, "", 0, "NU", "Front steering knuckle. Left and right are quoted individually. Often replaced after curb or impact damage."],
  ["wheel-hub-bearing", "Wheel Hub & Bearing", "hub", 1, "", 1, "N", "Wheel hub with bearing. Front and rear, left and right are quoted individually."],
  ["anti-roll-bar", "Anti-Roll Bar", "controlarm", 3, "", 0, "NU", "Anti-roll bar. Active stabiliser bars with hydraulic or electric actuators are matched by part number."],
]);
t("v", "brakes", [
  ["front-brake-disc-set", "Front Brake Disc Set", "disc", 1, "", 2, "N", "Pair of front brake discs. Disc diameter depends on the brake package fitted, so the VIN or current disc size is needed."],
  ["rear-brake-disc-set", "Rear Brake Disc Set", "disc", 1, "", 1, "N", "Pair of rear brake discs, matched to the brake package fitted."],
  ["brake-pad-set", "Brake Pad Set", "pads", 1, "", 1, "N", "Brake pads for one axle with wear sensor where fitted. Front and rear sets are quoted individually."],
  ["front-brake-caliper", "Front Brake Caliper", "caliper", 1, "", 1, "NUR", "Front brake caliper. Left and right are quoted individually. Performance brake packages use different calipers and carriers."],
  ["rear-brake-caliper", "Rear Brake Caliper", "caliper", 2, "", 0, "NUR", "Rear brake caliper, supplied with electric parking brake actuator where it is part of the assembly."],
  ["abs-pump-module", "ABS / Stability Control Unit", "ecu", 1, "", 1, "NU", "ABS and stability control hydraulic unit with control module. Matched by part number and coded to the vehicle after fitting."],
  ["brake-booster", "Brake Booster", "caliper", 3, "", 0, "NU", "Brake servo or electro-mechanical brake booster, matched to the vehicle specification."],
]);
t("v", "body-parts", [
  ["front-bumper", "Front Bumper", "bumper", 1, "", 2, "NU", "Front bumper cover. New bumpers are supplied primed for painting. Tell us whether the car has parking sensors, headlight washers, cameras or a sport package, because each changes the part number."],
  ["rear-bumper", "Rear Bumper", "bumper", 1, "", 2, "NU", "Rear bumper cover. New bumpers are supplied primed for painting. Sensor, tow bar and exhaust-trim configurations are confirmed before quoting."],
  ["bonnet", "Bonnet / Hood", "bonnet", 1, "", 2, "NU", "Hood panel. New panels are supplied in primer. Hinges, struts and insulation are quoted separately."],
  ["front-fender", "Front Wing / Fender", "fender", 1, "", 1, "NU", "Front wing panel. Left and right are quoted individually. New panels are supplied in primer."],
  ["front-grille", "Front Grille", "grille", 1, "", 2, "NU", "Front radiator grille. Versions differ by trim line, camera and radar equipment and model year."],
  ["front-door", "Front Door", "door", 2, "", 1, "NU", "Front door shell. Left and right are quoted individually. Supplied bare unless a complete door with glass and trim is requested."],
  ["rear-door", "Rear Door", "door", 2, "no2door", 0, "NU", "Rear door shell. Left and right are quoted individually. Supplied bare unless a complete door is requested."],
  ["tailgate", "Tailgate / Boot Lid", "tailgate", 1, "", 1, "NU", "Tailgate or trunk lid panel. Supplied bare, or complete with glass, wiring and lock on request."],
  ["wing-mirror", "Wing Mirror", "mirror", 1, "", 1, "NU", "Complete door mirror. Functions such as power folding, auto-dimming, blind spot warning and cameras change the part number, so the VIN is needed.", { sides: 1 }],
  ["radiator-support", "Front Panel / Radiator Support", "bumper", 2, "", 1, "NU", "Front panel that carries the radiators and headlights. Commonly replaced after frontal damage."],
  ["bumper-reinforcement", "Bumper Reinforcement Bar", "bumper", 2, "", 0, "NU", "Front or rear bumper crash bar with crush boxes."],
  ["body-kit", "Body Kit", "bumper", 3, "", 1, "N", "Complete styling kit, typically front bumper, rear bumper, side skirts and trims in the factory sport or performance design. Supplied primed for painting, with a list of every component included."],
  ["front-cut", "Front Cut (Complete Front End)", "bumper", 2, "", 2, "U", "Complete front section taken from a donor vehicle, typically bumper, headlights, hood, fenders, front panel and radiator pack. Supplied with or without the engine, as agreed. The quotation lists every panel and component included, with photographs of the actual unit."],
  ["facelift-conversion-kit", "Facelift / New-Look Conversion Kit", "bumper", 2, "", 2, "N", "Kit to update an earlier car to the later facelift appearance. Contents vary by model and normally include bumpers, lights, grille and the brackets and wiring adapters needed to fit them. We list every component in the quotation."],
  ["side-step-set", "Side Step / Running Board Set", "panel", 2, "suvvan", 0, "N", "Pair of side steps with mounting brackets. Fixed and electrically deployable versions are available for some models."],
  ["panoramic-roof", "Panoramic Sunroof Assembly", "panel", 3, "", 0, "NU", "Panoramic roof cassette with glass, frame and motors. Glass panels and blinds can also be quoted on their own."],
  ["windscreen", "Windscreen", "panel", 3, "", 0, "N", "Laminated windshield. Rain sensor, camera bracket, head-up display and acoustic options are confirmed against the VIN."],
]);
t("v", "lighting", [
  ["headlight", "Headlight", "headlight", 1, "", 2, "NU", "Complete headlight unit. Halogen, xenon, LED, matrix and laser versions are not interchangeable without additional parts and coding. Send the part number on your existing light or the VIN so we match the correct version.", { sides: 1 }],
  ["tail-light", "Tail Light", "taillight", 1, "", 2, "NU", "Rear light unit. Outer (body) and inner (tailgate) sections are separate parts on most models. Tell us which section and which side you need.", { sides: 1 }],
  ["fog-light", "Fog Light / Daytime Running Light", "foglight", 2, "", 0, "N", "Front fog light or daytime running light unit. Left and right are quoted individually."],
  ["headlight-control-module", "Headlight Control Module", "ecu", 2, "", 1, "N", "LED driver or headlight control module. A common repair when one function of the headlight stops working. Matched by the number printed on the module."],
]);
t("v", "cooling", [
  ["radiator", "Radiator", "radiator", 1, "noev", 2, "N", "Main engine coolant radiator, matched to engine and gearbox."],
  ["radiator-fan", "Radiator Fan Assembly", "fan", 1, "", 1, "N", "Electric cooling fan with shroud and control unit. Fan wattage differs by engine and climate specification."],
  ["ac-condenser", "A/C Condenser", "radiator", 1, "", 1, "N", "Air-conditioning condenser with receiver-drier where integrated."],
  ["coolant-expansion-tank", "Coolant Expansion Tank", "tank", 2, "", 0, "N", "Coolant expansion tank with level sensor and cap."],
  ["heater-blower-motor", "Heater Blower Motor", "fan", 2, "", 0, "N", "Interior heater and air-conditioning blower motor, with regulator where integrated."],
  ["auxiliary-radiator", "Auxiliary / Low-Temperature Radiator", "radiator", 3, "", 0, "N", "Additional radiator for the charge air, transmission or low-temperature circuit. Several are fitted to some models, so we confirm the position before quoting."],
]);
t("v", "electrical", [
  ["instrument-cluster", "Instrument Cluster", "cluster", 2, "", 1, "NU", "Instrument cluster, analogue or fully digital according to specification. Clusters store vehicle data and need professional coding to the car after fitting."],
  ["infotainment-screen", "Infotainment Display", "screen", 1, "", 1, "NU", "Central display screen. Screen size and connector type depend on the infotainment generation fitted to the car."],
  ["infotainment-head-unit", "Infotainment Head Unit", "ecu", 2, "", 1, "NU", "Navigation and media control unit. Matched by hardware number and region, and usually coded to the vehicle after fitting."],
  ["infotainment-upgrade", "OEM-Style Infotainment Upgrade", "screen", 2, "", 1, "N", "Larger factory-style display and control unit for cars with an older infotainment system. Integration with the existing controls, cameras and audio system is checked against your VIN before quoting."],
  ["body-control-module", "Body Control Module", "ecu", 2, "", 0, "NU", "Body electronics control unit. Matched by part number and coded to the vehicle."],
  ["radar-sensor", "Radar Sensor (Adaptive Cruise)", "sensor", 2, "", 1, "NU", "Front radar sensor for adaptive cruise control and collision warning. Requires calibration after fitting."],
  ["camera", "Camera (Front, Rear or Surround View)", "sensor", 2, "", 0, "N", "Parking or surround-view camera. Tell us the camera position. Matched by part number."],
  ["parking-sensor-set", "Parking Sensor Set", "sensor", 1, "", 0, "N", "Ultrasonic parking sensors for the front or rear bumper, supplied unpainted."],
  ["window-regulator", "Window Regulator", "regulator", 1, "", 0, "N", "Door window regulator with or without motor. Front and rear, left and right are quoted individually."],
  ["door-lock-actuator", "Door Lock Actuator", "regulator", 2, "", 0, "N", "Door latch with central locking actuator. Soft-close and keyless versions are separate part numbers."],
  ["wiper-motor-linkage", "Wiper Motor & Linkage", "regulator", 2, "", 0, "N", "Windshield wiper motor with linkage."],
  ["power-tailgate-strut", "Power Tailgate Strut", "strut", 2, "suvvan", 1, "N", "Electric tailgate lifting strut. Left and right units are quoted individually or as a pair."],
  ["fuel-pump-module", "Fuel Pump Module", "pump", 1, "noev", 1, "N", "In-tank fuel pump module with level sender, plus the fuel pump control unit where it is a separate part."],
  ["onboard-charger", "On-Board Charger", "ecu", 1, "ev", 1, "NU", "On-board charging unit. Matched by part number to the battery and charging specification of the vehicle."],
  ["charge-port", "Charge Port Assembly", "sensor", 1, "ev", 0, "NU", "Charge port with wiring. The connector standard depends on the market the car was built for."],
]);
t("v", "interior", [
  ["dashboard", "Dashboard Assembly", "dashboard", 2, "", 2, "NU", "Dashboard panel. Tell us the trim material and color, whether the car is left- or right-hand drive, and whether it has a head-up display. Supplied bare or with vents and trims, as agreed in the quotation."],
  ["dashboard-upgrade-kit", "Dashboard & Infotainment Upgrade Kit", "dashboard", 2, "", 2, "N", "Kit to update the cabin to a later dashboard design. Kits normally cover the dashboard, vents, screens, center console, controller and wiring. This is a conversion, not a plug-and-play part: wiring, coding and left- or right-hand drive are checked against your VIN, and the quotation lists every component included."],
  ["interior-upgrade-package", "Interior Upgrade Package", "seat", 3, "", 1, "N", "Package to refresh or upgrade the cabin: seats or seat covers, door cards, console, trims and ambient lighting, as specified. Send photographs of the current interior and tell us the result you want. We confirm what can be supplied for your vehicle."],
  ["vip-interior-conversion", "VIP Interior Conversion", "seat", 1, "van", 2, "N", "Full passenger-cabin conversion for vans: captain chairs, partition, roof and floor trim, lighting, tables and entertainment equipment, built to the layout you specify. Cabin dimensions, seat layout, electrical requirements and installation scope are confirmed before quoting."],
  ["complete-seat-set", "Complete Seat Set (Front & Rear)", "seat", 2, "", 1, "U", "Front and rear seats supplied as a matched set. Mounts, electrical functions and trim are checked against your vehicle, and photographs of the actual seats are supplied before you confirm."],
  ["front-seat-set", "Front Seat Set", "seat", 2, "", 1, "U", "Pair of front seats. Trim color, heating, ventilation, massage and memory functions vary from car to car, so photographs of the actual seats are supplied before you confirm."],
  ["rear-seat", "Rear Seat Assembly", "seat", 3, "", 0, "U", "Rear seat bench or individual rear seats. Photographs of the actual seats are supplied before you confirm."],
  ["steering-wheel", "Steering Wheel", "steeringwheel", 1, "", 2, "NU", "Steering wheel. Heated rim, shift paddles, driver-assistance buttons and trim design all change the part number. Supplied without airbag module."],
  ["centre-console", "Centre Console", "dashboard", 2, "", 1, "NU", "Center console assembly or trim panel, matched by color and equipment."],
  ["door-panel-set", "Door Panel Set", "door", 2, "", 0, "NU", "Interior door cards, matched by trim color, speaker system and ambient lighting."],
  ["headliner", "Headliner", "panel", 3, "", 0, "NU", "Roof lining, matched by color and roof type."],
  ["interior-trim-set", "Interior Trim Set", "dashboard", 3, "", 0, "N", "Decorative trim strips for the dashboard, console and doors in wood, aluminum, piano black or carbon finishes."],
]);
t("v", "fuel-exhaust", [
  ["exhaust-system", "Exhaust System", "exhaust", 2, "noev", 1, "NU", "Exhaust system from the center section back, or individual mufflers and tailpipe trims on request."],
  ["catalytic-converter", "Catalytic Converter", "exhaust", 2, "noev", 1, "N", "Catalytic converter. Emissions parts are specific to the market and emissions standard of the vehicle, so the VIN is required."],
  ["fuel-tank", "Fuel Tank", "tank", 3, "noev", 0, "NU", "Fuel tank, supplied with or without pump module."],
]);
t("v", "wheels", [
  ["alloy-wheel-set", "Alloy Wheel Set", "wheel", 1, "", 2, "NU", "Set of four alloy wheels. Tell us the diameter and design you want, or send a photograph. Supplied with or without tires and pressure sensors."],
]);

export const PART_TYPES = P;

// Existing listings carried over from the previous site: key -> fixed slug, SKU, OEM reference.
// key format: v|make|model|gen|part[|side]  e|ENGINE|part  g|gearboxSlug|part
export const LEGACY = {
  "e|B58|complete-engine": ["bmw-b58-3-0-turbo-complete-engine", "ENG-BMW-B58-001", "11002455444"],
  "e|N63|complete-engine": ["bmw-n63-4-4-twin-turbo-engine", "ENG-BMW-N63-002", "11002420052"],
  "e|M177|complete-engine": ["mercedes-m177-4-0-v8-engine", "ENG-MB-M177-003", "1770107100"],
  "e|EA839|complete-engine": ["audi-ea839-3-0-v6-turbo-engine", "ENG-AUDI-EA839-004", "06E100033M"],
  "e|B58|water-pump": ["bmw-b58-water-pump", "CLG-BMW-B58-010", "11518482251"],
  "e|B58|turbocharger": ["bmw-b58-turbocharger", "TRB-BMW-B58-070", "11658601506"],
  "e|B58|engine-ecu": ["bmw-g30-engine-ecu-dme", "ELE-BMW-G30-040", "12148665570"],
  "v|bmw|X5|G05|radiator": ["bmw-x5-g05-radiator", "CLG-BMW-X5-011", "17118623323"],
  "v|bmw|X5|G05|air-suspension-compressor": ["bmw-x5-g05-air-suspension-compressor", "SUS-BMW-X5-020", "37206884682"],
  "v|bmw|X5|G05|front-bumper": ["bmw-x5-g05-front-bumper", "BDY-BMW-X5-060", "51118069074"],
  "v|bmw|7 Series|G11|front-seat-set": ["bmw-g11-front-seat-left", "INT-BMW-G11-110", "52107446729"],
  "v|range-rover|Range Rover Sport|L494|front-air-strut": ["range-rover-sport-l494-front-air-strut", "SUS-RR-L494-021", "LR069656"],
  "v|mercedes-benz|GLE|W167|front-brake-caliper": ["mercedes-gle-w167-front-brake-caliper", "BRK-MB-W167-030", "A1674211081"],
  "v|porsche|Cayenne|9YA|front-brake-disc-set": ["porsche-cayenne-9ya-brake-disc-set", "BRK-POR-9YA-031", "9Y0615301"],
  "v|audi|Q7|4M|headlight|right": ["audi-q7-4m-matrix-led-headlight-right", "LGT-AUDI-Q7-050", "4M0941774"],
  "v|land-rover|Defender|L663|steering-rack": ["land-rover-defender-l663-steering-rack", "STR-LR-L663-090", "LR121449"],
  "e|V35A-FTS|alternator": ["lexus-lx-j300-alternator", "ELE-LEX-LX-100", "270600S030"],
  "v|volvo|XC90|SPA|radiator-fan": ["volvo-xc90-radiator-fan-assembly", "CLG-VOL-XC90-120", "31368286"],
  "g|zf-8hp70|gearbox": ["zf-8hp70-automatic-gearbox", "TRN-ZF-8HP70-080", "24008616260"],
  "g|mercedes-9g-tronic-725|gearbox": ["mercedes-9g-tronic-725-gearbox", "TRN-MB-725-081", "A7252704000"],
};
