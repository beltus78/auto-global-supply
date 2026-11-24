export type Guide = { slug: string; title: string; excerpt: string; description: string; tags: string[]; published: string; body: string };

export const GUIDES: Guide[] = [
  {
    slug: "how-to-identify-the-correct-bmw-engine",
    title: "How to Identify the Correct BMW Engine",
    excerpt: "The engine code is stamped on the block and encoded in your VIN. Here is how to read both before ordering.",
    description: "Read your BMW engine code and VIN correctly before buying a replacement engine: where the code is, why the index matters and what photos to send.",
    tags: ["BMW", "Engines"],
    published: "2026-09-12",
    body: `Ordering the wrong engine is expensive, and BMW uses several engine families that look similar from the outside.

## 1. Read the engine code on the block
On most modern BMW engines the code (for example B58, N63, N55) is cast or stamped near the front of the block, close to the cylinder head joint. Clean the area before photographing it.

## 2. Check your VIN
The VIN identifies the exact build of your vehicle, including engine variant, gearbox and factory options. Send it to us and we will confirm which engine index fits.

## 3. Compare the index, not just the family
The same family (B58 for example) covers several indexes with different components. Matching only the family name is not enough on later cars.

## 4. Photograph the ancillaries
Turbocharger position, wiring plugs and mounting brackets vary between applications. Photos let us verify the fit before anything is shipped.`,
  },
  {
    slug: "how-to-find-your-oem-part-number",
    title: "How to Find Your OEM Part Number",
    excerpt: "OEM numbers are the fastest way to order the right part. Here is where to find them.",
    description: "Where OEM part numbers are printed on car parts, why they matter more than the part name, and what to send us if you cannot find the number.",
    tags: ["Guides", "OEM"],
    published: "2026-09-12",
    body: `An OEM number identifies a part exactly as the manufacturer catalogued it.

## Where to look
- Printed or stamped on the part itself, often on a label or moulded boss
- On the original packaging
- In the manufacturer parts catalog, searched by VIN

## Why it matters
Part names vary between markets and translations. The OEM number does not. If you send us a number we can cross-reference alternatives and equivalent aftermarket components.

## If you cannot find it
Send photos of the part from several angles, plus your VIN. We can usually identify it from that.`,
  },
  {
    slug: "used-engine-vs-reconditioned-engine",
    title: "Used Engine vs Reconditioned Engine",
    excerpt: "The difference matters for price, warranty and expected life.",
    description: "Used engine or reconditioned engine? What separates them on price, condition and expected life, and how to choose the right one for your car.",
    tags: ["Engines", "Buying"],
    published: "2026-09-12",
    body: `## Used engine
A complete engine removed from a donor vehicle. It is cleaned, inspected and usually compression tested. Price is lower, and condition depends on the donor.

## Reconditioned engine
An engine that has been disassembled, measured and rebuilt with new wear components. Expect a higher price and a longer expected service life.

## Which should you buy?
For an older vehicle or a short-term repair, a tested used engine is often the sensible choice. For a vehicle you intend to keep, a reconditioned unit is usually better value over time.

Always agree the test and warranty terms in writing before payment.`,
  },
  {
    slug: "how-to-check-engine-compatibility-before-buying",
    title: "How to Check Engine Compatibility Before Buying",
    excerpt: "A short checklist that prevents the most common fitment mistakes.",
    description: "A five-point checklist for confirming replacement engine fitment before you pay: VIN, engine code and index, gearbox type, ancillaries and electronics.",
    tags: ["Guides", "Compatibility"],
    published: "2026-09-12",
    body: `Before you confirm an order, check these five points.

1. **VIN**: send it; it settles most questions instantly.
2. **Engine code and index**: the family alone is not enough.
3. **Gearbox type**: bellhousing and flywheel differ between manual and automatic applications.
4. **Ancillaries included**: confirm what is on the engine and what you must transfer.
5. **Electronics**: control modules are often vehicle-matched and may need coding.

Send us the details and we will confirm fitment in writing before dispatch.`,
  },
  {
    slug: "what-information-to-send-when-ordering-a-spare-part",
    title: "What Information Should You Send When Ordering a Spare Part?",
    excerpt: "Send these details and we can usually quote the same day.",
    description: "The information our parts team needs to quote an auto part accurately and quickly: VIN, part number, photos, quantity and delivery address.",
    tags: ["Guides", "Ordering"],
    published: "2026-09-12",
    body: `To quote accurately we need:

- Vehicle make, model and year
- VIN (the single most useful piece of information)
- Engine code, if the part is engine related
- OEM number, if you have it
- Part name or description, plus photos
- Quantity
- Delivery state, city and ZIP code
- Preferred contact: email or WhatsApp

If you do not know the technical name of the part, send a photo. That is usually enough.`,
  },
  {
    slug: "dashboard-upgrade-kits-what-to-check-before-ordering",
    title: "Dashboard Upgrade Kits: What to Check Before Ordering",
    excerpt: "A later-style dashboard is a conversion, not a bolt-on part. These checks keep the project on track.",
    description: "What to confirm before ordering a dashboard or infotainment upgrade kit: steering side, wiring, coding, kit contents and installation.",
    tags: ["Upgrades", "Interior"],
    published: "2026-11-09",
    body: `Dashboard upgrades are among the requests we receive most, especially for the Mercedes-Benz V-Class and Vito W447. They can transform a cabin, and they need more checking than an ordinary part.

## 1. Left- or right-hand drive
Dashboards are built for one steering side. Tell us which you have. It is the first thing we confirm.

## 2. What the kit includes
Kits differ. A typical kit covers the dashboard, vents, screens, center console, controller and wiring. Steering wheels and other components are sometimes included and sometimes not. We list every item in the quotation so nothing is assumed.

## 3. Wiring and coding
A later-design dashboard was made for a later electrical system. Expect wiring adaptation and coding. Ask your installer whether they have done this conversion before, and send us your VIN so we can check the kit against your vehicle.

## 4. Existing equipment
Camera systems, sound systems, climate controls and driver assistance functions all connect through the dashboard. Tell us what your vehicle has so we can flag anything that changes.

## 5. Installation
We supply the kit. Fitting is carried out by your own repair shop, so agree the labor and the timescale with them before you order.`,
  },
  {
    slug: "front-cut-or-individual-parts-after-front-end-damage",
    title: "Front Cut or Individual Parts After Front-End Damage?",
    excerpt: "After a frontal impact you can buy every part separately or one complete front end. Here is how to decide.",
    description: "Front cut or individual parts after front-end damage? When a complete front end makes sense, what it includes and what to confirm before ordering.",
    tags: ["Body", "Buying"],
    published: "2026-11-09",
    body: `A front cut is the complete front section of a donor vehicle: typically the bumper, headlights, hood, wings, front panel and radiator pack, supplied together.

## When a front cut makes sense
- The damage covers many parts at once: bumper, both lights, hood, radiators and supports
- The individual parts are expensive or slow to obtain separately
- You want parts that already match each other in color and specification

## When individual parts are better
- Only two or three components are damaged
- You need new parts for a newer vehicle under insurance repair
- Shipping a large crate across the country is costly compared with the parts needed

## What to confirm
1. **Exactly what is included.** We list every panel and component in the quotation.
2. **Engine included or excluded.** Front cuts are offered both ways.
3. **Specification.** Headlight type, bumper style and radar or camera equipment must match your car.
4. **Photographs.** You receive photographs of the actual unit before you commit.

Send your VIN and photographs of the damage, and we will quote both routes where both are available.`,
  },
  {
    slug: "air-suspension-faults-which-part-do-you-need",
    title: "Air Suspension Faults: Which Part Do You Need?",
    excerpt: "A car sitting low can mean a strut, a compressor or a valve block. Replacing the wrong one is a common mistake.",
    description: "Car sitting low? How to tell whether an air suspension fault points to an air strut, the compressor or the valve block before you order parts.",
    tags: ["Suspension", "Guides"],
    published: "2026-11-09",
    body: `Air suspension parts are among the most requested items for large SUVs and saloons. The symptoms overlap, so it helps to narrow the fault before ordering.

## One corner drops overnight
This usually points to a leak in that corner's air strut or air spring. The compressor is often still healthy.

## The whole car is low and will not rise
Suspect the compressor or its relay. A compressor that has been working against a leak for months often fails as a result, which is why both are frequently replaced together.

## The car rises unevenly or drops after rising
The valve block, which distributes air to each corner, may be leaking internally.

## The compressor runs constantly
There is a leak somewhere in the system. Replacing only the compressor will not last.

## What to send us
- VIN
- Which corner or corners are affected
- Any fault codes your repair shop has read
- Whether the car has adaptive damping

A repair shop diagnosis is always the right first step. With the result, we can quote the correct parts in one go.`,
  },
  {
    slug: "mercedes-w447-dashboard-upgrade-guide",
    title: "Mercedes V-Class & Vito W447 Dashboard Upgrade Guide",
    excerpt: "Fitting the later wide-screen dashboard to an earlier V-Class or Vito: what the kit contains, what changes behind it and what to check first.",
    description: "Planning a Mercedes V-Class or Vito W447 dashboard upgrade? What the kit includes, steering side, wiring, coding and installation explained.",
    tags: ["Mercedes-Benz", "Dashboards", "Upgrades"],
    published: "2026-11-14",
    body: `The Mercedes-Benz V-Class and Vito (W447) have been built since 2014, and the dashboard has changed during that time. The most recent update brought a dashboard with a wide twin-screen display. Owners of earlier vans often want that look without changing the vehicle, which is why W447 dashboard kits are the interior request we receive most.

## What a W447 dashboard kit usually includes
Kits are not all the same. The kits we supply are specified per van, and a typical scope covers:

- The dashboard itself, in the later design
- Air vents to suit the new dashboard
- The infotainment and instrument screens
- The center console
- The controller or touchpad
- The wiring needed to connect the new components

Some packages also include the steering wheel and driver airbag. Your quotation lists every component, so nothing is assumed.

## Check the steering side first
Dashboards are built for left- or right-hand drive only. Tell us which you have. It is the first thing we confirm, because a dashboard for the other side cannot be adapted.

## Wiring and coding
A later dashboard was designed around a later electrical system. Expect your installer to adapt wiring and code the new modules to the van. Plug-and-play fitment is not something we promise. Ask your installer whether they have done a W447 conversion before, and agree the labor and the timescale with them before you order.

## Existing equipment
Cameras, sound systems, climate controls, parking sensors and driver-assistance functions all connect through the dashboard area. Tell us what your van has, including 4MATIC, the trim line and any factory options, so we can flag anything that changes.

## Vito Tourer and V-Class differences
The Vito Tourer and V-Class share the W447 platform but not every interior component. Equipment levels differ, so we check the kit against the VIN rather than the model name alone.

## Going further: complete interiors
Many W447 owners combine the dashboard with seats, a partition, roof trim, lighting and entertainment equipment for a full VIP cabin. These are specified to your layout. See [VIP interior conversions](/parts?part=vip-interior-conversion) and our [parts and upgrades page](/parts-upgrades) for examples of what customers have requested.

## How to get a quotation
Send your VIN, the steering side, photographs of the current dashboard and a photo or description of the look you want. You can [request a quote here](/request-a-part) or browse [W447 dashboard listings](/dashboards/mercedes-benz).`,
  },
  {
    slug: "replacement-car-dashboard-new-used-or-upgrade",
    title: "Replacement Car Dashboard: New, Used or Upgrade Kit?",
    excerpt: "After airbag deployment, cracking or sun damage you have three routes. Here is how to choose between them.",
    description: "Choosing a replacement car dashboard after cracks, sun damage or airbag deployment: new, used or an upgrade kit, and what to check before you buy.",
    tags: ["Dashboards", "Buying"],
    published: "2026-11-14",
    body: `A damaged dashboard is one of the more involved interior repairs. You have three routes, and the right one depends on why the dashboard needs replacing and how long you plan to keep the car.

## When a dashboard needs replacing
- **Airbag deployment.** The passenger airbag door often tears the dashboard surface.
- **Cracking and sun damage.** Common on cars kept in hot climates.
- **Fire or water damage.** Usually affects the electronics behind the dashboard too.
- **Style.** Some owners want a later or higher-specification design.

## Option 1: a used dashboard in the original design
A good used dashboard from a donor car keeps the cabin exactly as it was. It is usually the most economical route. Ask for photographs of the actual unit and check the trim color, the stitching and the cut-outs for the display and head-up unit.

## Option 2: a new dashboard in the original design
A new dashboard suits a newer car, or a repair where condition matters most. Availability depends on the model, so the quotation states the lead time.

## Option 3: a dashboard upgrade kit
An upgrade kit replaces the original design with a later one. It changes the look of the cabin, but it is a conversion: wiring adaptation and coding are part of the job. Read our guide to [what to check before ordering a dashboard kit](/guides/dashboard-upgrade-kits-what-to-check-before-ordering).

## What to check whichever route you take
1. **Steering side.** Left- and right-hand drive dashboards are different parts.
2. **Trim color and material.** Match it to the rest of the cabin.
3. **Head-up display and airbag layout.** These change the dashboard shape.
4. **Display size.** The cut-out must match the infotainment generation in the car.
5. **Airbag system.** After deployment, airbag modules and the control unit also need attention. Ask us to quote them with the dashboard.

## Instrument clusters and screens
If only the cluster or the central screen has failed, the dashboard itself may not need replacing. Clusters and screens are matched by part number and coded to the car. Browse [instrument clusters](/parts?part=instrument-cluster) and [infotainment screens](/parts?part=infotainment-screen).

## Getting a quotation
Send your VIN, photographs of the current dashboard and the route you prefer. See all [dashboards and dashboard kits](/dashboards) or [request a quote](/request-a-part).`,
  },
  {
    slug: "car-interior-parts-buying-checklist",
    title: "Car Interior Parts Buying Checklist: Seats, Trim & More",
    excerpt: "Interior parts depend on trim, color and equipment, not just the model. Use this checklist before ordering seats, wheels, consoles or trim.",
    description: "A checklist for buying car interior parts: seats, steering wheels, consoles, door panels and trim matched by VIN, color, equipment and steering side.",
    tags: ["Interior", "Buying"],
    published: "2026-11-14",
    body: `Two cars of the same model can have very different interiors. Seat design, leather color, stitching, trim inlays and equipment all vary. This checklist helps you order the right part the first time.

## For every interior part
- **VIN.** It identifies the factory trim and equipment.
- **Photographs.** Show the part you are replacing and the cabin around it.
- **Steering side.** Dashboards, consoles and some trims differ between left- and right-hand drive.
- **Color and material.** Name it if you know it, and photograph it in daylight.

## Seats
- Which functions the seat has: heating, ventilation, massage, memory, electric adjustment
- Whether side airbags are fitted in the seat
- Front pair only, or a [complete front and rear set](/parts?part=complete-seat-set)
- For used seats, ask for photographs of the actual seats before you confirm

## Steering wheels
- Rim design and material
- Heated rim, shift paddles and driver-assistance buttons
- Steering wheels are normally supplied without the airbag module

## Center consoles and door panels
- Trim color and inlay finish
- The controls in the console, such as the controller, gear selector and climate panel
- Speaker system and ambient lighting in the door panels

## Headliners and trim
- Roof type: standard, sunroof or panoramic roof
- Inlay finish: wood, aluminum, piano black or carbon

## Upgrades and conversions
Interior upgrade packages and VIP van conversions are specified to your layout. Describe the result you want and the equipment that must stay. See [interior upgrades](/parts?part=interior-upgrade-package) and [VIP interior conversions](/parts?part=vip-interior-conversion).

## Next step
Browse [all car interior parts](/interior-parts) by brand and model, or [send a request](/request-a-part) with your VIN and photographs.`,
  },
  {
    slug: "mercedes-s-class-w222-dashboard-peeling-replacement",
    title: "Mercedes S-Class W222 Dashboard Peeling: Repair or Replace?",
    excerpt: "The leather-covered upper dashboard on some W222 S-Class cars lifts and curls after long spells of heat. Here are your options and what to check before buying a replacement.",
    description: "W222 S-Class dashboard lifting, curling or peeling? Compare re-bonding, a used dashboard and a new one, and see what to check before you order.",
    tags: ["Mercedes-Benz", "Dashboards"],
    published: "2026-11-17",
    body: `The Mercedes-Benz S-Class W222 was built from 2013 to 2020, with a facelift in 2017. Many cars have a leather-covered upper dashboard, and owners in hot climates regularly report the same fault: the leather starts to lift along the edges, curls back near the windshield and wrinkles across the top of the dashboard. There are usually no tears. The covering simply lets go of the panel underneath.

If that is happening to your car, you have three routes. Which one makes sense depends on how far the damage has gone, how long you plan to keep the car and how close the replacement needs to match.

## Why the dashboard lifts
The upper dashboard is a moulded panel with leather bonded over it. Long periods of strong sun and high cabin temperature soften the adhesive, and the leather shrinks slightly as it dries out. Once an edge lifts, heat gets under it and the problem spreads. Parking in shade and using a reflective windshield shade slows it down, but it does not reverse it.

## Option 1: re-bond the existing covering
An experienced trimmer can sometimes soften the leather and glue it back down. On the W222 this is not a quick job. The dashboard top sits under the windshield and around the display, so the panel normally has to come out to do it properly.

- **Best for:** early lifting along one edge, with the leather still in good condition.
- **Watch out for:** leather that has shrunk. If it no longer covers the panel, re-bonding will not look right.

## Option 2: a used dashboard in the original design
A good used dashboard from a donor car is usually the most economical way to get an undamaged surface. It keeps the cabin exactly as it was.

- Ask for **photographs of the actual unit**, especially the leather along the windshield edge and around the display.
- Check the **trim color and stitching** match the rest of your interior.
- Confirm whether the part is the **complete dashboard assembly** or only the upper section. Listings are not always clear.
- A used dashboard from a car that lived in the same climate may already be starting to lift. Look closely at the edges in the photos.

## Option 3: a new dashboard
A new dashboard suits a car you plan to keep for years, or when the existing one also has other damage. Availability and lead time depend on the exact version, so the quotation states both.

## Pre-facelift or facelift: does it matter?
Yes. The W222 changed in 2017, and the dashboard was updated with it. When ordering a replacement in the original design, match it to your car's model year and equipment. Some owners use the opportunity to fit the later style. That is a conversion rather than a straight swap: the instrument cluster, displays, wiring and coding all need to suit, and it should be planned with your installer.

## What to check before you order
1. **VIN.** It settles the version, trim and equipment.
2. **Steering side.** Left- and right-hand drive dashboards are different parts.
3. **Leather color and stitching.** Photograph the current dashboard in daylight.
4. **Head-up display.** Cars with a head-up display have a different dashboard opening.
5. **Speaker and sensor openings.** Premium sound systems and sun sensors change the cut-outs.
6. **Trim strips.** Wood, aluminum or piano black inlays may need to be ordered separately.

## Fitting
Replacing a W222 dashboard is a repair shop job. The windshield area, airbags, displays and wiring are all involved. Agree the labor and the timescale with your installer before you order, and ask whether they have done one on this model before.

## While the dashboard is out
If the dashboard is coming out anyway, it is a good moment to deal with anything else in that area: a failing display, a worn trim strip or a cracked vent. Our [W222 parts list](/parts?make=mercedes-benz&model=s-class&gen=w222) shows the interior and electrical parts we supply for this model.

## Common questions
**Will the new dashboard lift in the same way?** Any leather-covered dashboard can lift if the car is kept in strong heat for long periods. A new panel starts with fresh adhesive, and shade, a reflective windshield shade and leather care all slow the process down.

**Can I fit a dashboard from a different S-Class version?** Only within the same layout. The coupe and convertible (C217 and A217) are separate models and should be matched on their own, and Maybach and AMG versions can carry different trim. The VIN is the safest guide.

**Do I lose any settings when the dashboard is replaced?** The dashboard panel itself stores nothing. Displays, the instrument cluster and control units do, so keep the originals unless they are also being replaced, and ask your repair shop to check for fault codes after fitting.

**Is it worth replacing the dashboard on an older car?** If the rest of the interior is in good condition, a used dashboard in the original design usually restores the cabin for the lowest cost. If the car also needs seats, trim or displays, look at the interior as a whole before deciding. Our [interior parts for Mercedes-Benz](/interior-parts/mercedes-benz) page lists the options by model.

## How the parts are shipped
A dashboard is large and easy to damage. We ship dashboards crated or in reinforced cartons, with the leather surface protected and loose trims packed separately. Shipping is free within the US and takes 1 to 3 business days. The packing method is stated in the quotation.

## Getting a quotation
Send your VIN, the steering side, photographs of the current dashboard and the route you prefer: used, new or a later-style conversion. Browse [Mercedes-Benz dashboards](/dashboards/mercedes-benz) or all [dashboards and dashboard kits](/dashboards), and [request a quote](/request-a-part) when you are ready.`,
  },
  {
    slug: "mercedes-v-class-vip-interior-conversion-guide",
    title: "Mercedes V-Class VIP Interior Conversion: Planning Guide",
    excerpt: "Captain chairs, a partition, a new roof lining, lighting and screens. How to plan a V-Class or Vito VIP cabin so the parts arrive complete and fit your van.",
    description: "Planning a Mercedes V-Class or Vito W447 VIP interior conversion? Seat layout, partition, trim, lighting, electrics and what to send for a quotation.",
    tags: ["Mercedes-Benz", "Interior", "Upgrades"],
    published: "2026-11-17",
    body: `The Mercedes-Benz V-Class and Vito (W447) are the most common base for VIP and executive van interiors. A full conversion replaces most of the passenger cabin: seats, partition, roof and floor trim, lighting, tables and entertainment equipment. Done well, it turns a people carrier into a mobile office or a chauffeur vehicle. Done without a plan, it leads to parts that do not fit, wiring that has to be redesigned and weeks of delay.

This guide covers what to decide before you request a quotation.

## 1. Decide what the van is for
The use decides the layout.

- **Chauffeur and airport transfers:** two or four captain chairs facing forward, a partition with a screen, and easy entry through the sliding doors.
- **Mobile office or meetings:** face-to-face seating, a fold-out table, power outlets and a screen.
- **Family or private use:** more seats, more storage, and simpler trim that is easy to clean.

Write down how many passengers must travel and where the luggage goes. Every other choice follows from that.

## 2. Choose the seat layout
Captain chairs are the center of most VIP builds. Each chair adds weight and needs a secure mounting. Before you choose a layout, confirm:

- the wheelbase of your van (compact, long or extra long), because it decides how many rows fit
- whether the existing seat rails will be used or new mounting points are needed
- which functions the chairs need: electric recline, leg rest, heating, ventilation or massage
- whether the seats must face forward for the routes you drive. Rules on seating and seat belts vary by state, so check what applies where the van is registered.

## 3. Partition, roof and floor
- **Partition:** separates the driver's cab from the passengers. It can include a screen, a sliding window or a privacy glass panel, and it needs wiring for whatever it carries.
- **Roof lining:** a new headliner, often with a starlight or ambient lighting design, and the routing for lights and air vents.
- **Floor:** new flooring or a raised floor that hides wiring. Raising the floor changes the headroom, so measure it first.

## 4. Electrics and equipment
This is where most conversions run into trouble. Every screen, light, fridge, power outlet and seat motor draws power and needs a route back to the battery. Plan:

- the total electrical load and whether a second battery is needed
- where the wiring will run, and how it will be fused
- which controls the passengers use: a touch panel, switches or a phone app
- how the new equipment connects to the van's existing systems, if at all

Your installer should approve the electrical plan before the parts are ordered.

## 5. The dashboard
Many owners combine a VIP rear cabin with the later-style dashboard at the front. A [W447 dashboard upgrade](/guides/mercedes-w447-dashboard-upgrade-guide) is a separate conversion with its own wiring and coding, so tell us at the start if you want both.

## 6. Kit contents
Ask for a component list, not a description. A good quotation lists every seat, panel, light, screen, cable set and fixing in the package, so you and your installer can check it against the plan. We supply the parts. Fitting is carried out by your own repair shop.

## Common mistakes to avoid
- **Ordering seats before measuring.** Chair width, recline angle and leg rests all need space. Measure the cabin from the partition position to the tailgate first.
- **Forgetting access.** Wide chairs can block the path to the rear row or the luggage area. Check how passengers get in and out through the sliding doors.
- **Leaving the electrics to the end.** Wiring routes are much easier to plan before the roof lining and floor go in.
- **Mixing styles from different suppliers.** Leather color, stitching and wood or carbon finishes rarely match exactly between suppliers. Ordering the trim as one package keeps the cabin consistent.
- **Ignoring weight.** Captain chairs, a partition, a fridge and a second battery add a lot of weight. Check the van's payload with your installer.

## Timeline and shipping
A full conversion is specified, supplied and then installed, and each stage takes time. Seats and trim in a particular color may be made to order. Large items such as chairs and partitions ship crated by freight, so the quotation states the lead time for the whole package. Shipping within the US is free. If the van is needed by a fixed date, tell us at the start so we can plan around it.

## After the conversion
Keep the component list and the wiring plan with the van. They make later repairs and changes much easier, and they help when the van is sold.

## What to send us
- VIN, model (V-Class, Vito Tourer or Vito panel van) and wheelbase
- the seat layout you want, ideally as a simple sketch
- photographs of the current interior
- the equipment list: screens, fridge, tables, lighting, sound
- the country where the van is registered

See [VIP interior conversions](/parts?part=vip-interior-conversion), the parts we list for the [V-Class W447](/parts?make=mercedes-benz&model=v-class&gen=w447) and examples on our [parts and upgrades page](/parts-upgrades). Browse all [interior parts](/interior-parts), then [request a quote](/request-a-part) with your plan.`,
  },
  {
    slug: "replacement-car-seats-wiring-airbags-fitment",
    title: "Replacement Car Seats: Wiring, Airbags & Fitment Checklist",
    excerpt: "Modern seats carry motors, heaters, sensors and airbags. Use this checklist before you buy replacement front seats or a complete set.",
    description: "Buying replacement car seats? Check airbags, occupant sensors, wiring plugs, functions, rails and trim before you order front seats or a full set.",
    tags: ["Interior", "Seats", "Buying"],
    published: "2026-11-17",
    body: `A front seat used to be a frame, foam and a cover. On a modern car it is also a piece of electrical equipment: motors, heating and ventilation, memory modules, seat-belt sensors and, in many cars, a side airbag. That is why a seat that looks right can still turn on a warning light or leave a function dead once it is fitted.

Use this checklist before you buy replacement seats, whether it is one damaged seat, a matching pair or a complete front and rear set.

## 1. Airbags and safety systems
- **Side airbags in the seat.** Many seats have a side airbag in the backrest. The replacement must have the same airbag arrangement as the original.
- **Occupant detection.** Many passenger seats have a sensor that tells the airbag system whether someone is sitting there. A seat without the right sensor can turn on the airbag warning light.
- **Seat-belt buckle sensors and pretensioners** may be part of the seat assembly.

Airbag components are safety equipment. Have them fitted and checked by a qualified repair shop, and make sure the warning light is off afterwards.

## 2. Functions and wiring
List every function your current seats have, then make sure the replacements match:

- electric adjustment, and how many directions
- memory positions
- lumbar support
- heating and ventilation
- massage
- adjustable side bolsters on sport seats

More functions usually mean more connectors under the seat. A seat with fewer functions than the car expects may need the car's settings changed. A seat with more functions than the car expects may not work without extra wiring and coding.

## 3. Rails and mounting
Seat rails and mounting points are usually shared within a model generation, but not always across generations or body styles. Coupe and convertible seats often differ from saloon seats, for example in how the backrest folds for rear access.

## 4. Trim, color and condition
- Leather color, stitching and perforation pattern
- Headrest design, and whether screens are built into the headrests
- Wear on the outer bolster of the driver's seat, which is the first place to show age

For used seats, always ask for photographs of the actual seats, taken in daylight, before you confirm.

## 5. One seat, a pair or a complete set?
Replacing a single seat is the cheapest option, but matching the color and wear of the other seats can be hard. A [front seat pair](/parts?part=front-seat-set) keeps the front of the cabin consistent. A [complete front and rear set](/parts?part=complete-seat-set) is the usual choice for a color change or an upgrade to sport or comfort seats.

## 6. Upgrading to a different seat design
Fitting seats from a higher trim level, such as sport or comfort seats, is a popular upgrade. Treat it as a conversion: confirm the wiring, the airbag arrangement and the coding with your installer first, and send us the VIN so we can check what the car was built with.

## Common mistakes
- **Buying by model name only.** The same model can be built with several seat designs and equipment levels. The VIN shows what your car has.
- **Ignoring the passenger seat sensor.** It is the most common cause of an airbag warning light after a seat swap.
- **Mixing colors.** Two shades of the same leather color look very different side by side, especially after years of sun. Compare photos in daylight.
- **Forgetting the rear seats.** If you change the front seats to a new color, the rear seats, door panels and center console may also need to match. See [door panels and other interior trim](/interior-parts).
- **Not checking the headrests.** Headrests with built-in screens or adjustable wings must match the seat they go on.

## How seats are shipped
Seats are heavy and bulky. We pack them on pallets or in strong cartons with the leather and the plugs protected. Shipping is free within the US and takes 1 to 3 business days, complete sets included. The packing method is stated in the quotation.

## After fitting
Ask your repair shop to clear and re-check the airbag system, test every function and, where needed, set up the memory positions. Keep the old seats until everything has been checked.

## What to send for a quotation
- VIN and steering side
- photographs of your current seats and the plugs underneath, if you can reach them
- the functions you want
- one seat, a pair or a full set, and the condition you prefer

Browse seats and other [car interior parts by brand](/interior-parts), read our [interior parts buying checklist](/guides/car-interior-parts-buying-checklist), and [request a quote](/request-a-part) when you have the details.`,
  },
  {
    slug: "zf-8hp-gearbox-identify-right-replacement",
    title: "ZF 8HP Gearbox: How to Identify the Right Replacement",
    excerpt: "The ZF eight-speed automatic is fitted to BMW, Audi, Jaguar, Land Rover, Rolls-Royce and more. Here is how to match the exact version before you buy.",
    description: "Replacing a ZF 8HP automatic gearbox? How to read the variant and type plate, why bellhousings differ, and what to send for an exact match.",
    tags: ["Gearboxes", "Buying"],
    published: "2026-11-17",
    body: `The ZF 8HP eight-speed automatic is one of the most widely used gearboxes in modern cars. It is fitted to BMW, Audi, Jaguar, Land Rover, Rolls-Royce, Maserati, Alfa Romeo, Stellantis models and others, behind gas, diesel and hybrid engines. That popularity makes used and remanufactured units easy to find. It also makes it easy to buy the wrong one.

## The family name is not enough
"8HP" is the family. The number that follows tells you the size and torque class:

- **8HP45 / 8HP50 / 8HP51 / 8HP55:** smaller and mid-torque applications
- **8HP70 / 8HP75 / 8HP76:** larger six-cylinder, V8 and diesel applications
- **8HP90 / 8HP95:** the highest-torque versions

The family has also been updated over the years in generations, and the later numbers within each class (for example 8HP50 after 8HP45, or 8HP75 after 8HP70) belong to later generations. A gearbox from a different generation can need a different control unit and different software, even when the size class is the same.

## Why two "identical" gearboxes do not interchange
Even within one variant, the gearbox is built for a specific vehicle and engine:

- **Bellhousing and case:** the bolt pattern, starter position and torque converter depth are specific to the engine. Two 8HP70 gearboxes from different BMW engines can have different bolt patterns.
- **Output flange:** the connection to the propshaft varies between manufacturers and models.
- **All-wheel drive versions** differ from rear-wheel drive versions, including how the transfer case attaches.
- **Mechatronic unit and software:** the control unit inside the gearbox is matched to the vehicle and usually needs coding or adaptation after fitting.

## How to identify your gearbox
1. **Read the type plate.** ZF gearboxes carry a plate or label on the case with the ZF part number and the vehicle manufacturer's number. Photograph it. It is the single most useful piece of information.
2. **Send the VIN.** It confirms the engine, drive type and build date.
3. **Note the engine code** if you have it.
4. **Note the drive type:** rear-wheel drive or all-wheel drive.

With the type plate and the VIN, we can match the replacement to your car rather than to the family name.

## Used, remanufactured or just the mechatronic unit?
- **Used and tested:** removed from a running vehicle. The most economical option.
- **Remanufactured:** rebuilt with new wear parts. Suits a car you plan to keep.
- **Mechatronic unit only:** some faults, such as harsh or erratic shifting, come from the control unit or valve body rather than the mechanical gearbox. A repair shop diagnosis tells you which you need. See [mechatronic units](/parts?part=mechatronic-unit).

## Torque converter and service parts
If the gearbox is being replaced because of contamination or overheating, the torque converter and the oil cooler should be considered at the same time. A new gearbox fitted to a contaminated cooler can fail early. Ask your repair shop, and add the parts to the same quotation if needed.

## Is it really the gearbox?
A gearbox is an expensive part, so it is worth confirming the fault before ordering one. Several problems can look like a failing gearbox:

- **Harsh or delayed shifts** can come from old or low fluid, or from the adaptation values in the control unit, and sometimes improve after a fluid service and a reset.
- **A shudder at low speed** can come from the torque converter rather than the gearbox itself.
- **A gear warning or limp mode** can be caused by a wiring fault, a sensor or the mechatronic unit.
- **Noises** can come from the propshaft, the center bearing, the differential or the engine mounts.

Ask your repair shop for the fault codes and a short description of the symptoms. Send them with your request, and we will tell you whether the complete gearbox, the mechatronic unit or a service kit is the right part to quote.

## The same gearbox under other names
Manufacturers give the 8HP their own names. Stellantis uses its own numbers for the versions it builds under license, and some manufacturers simply call it an eight-speed automatic. The ZF part number on the type plate is what links them, so a photograph of the plate is worth more than the name on a listing.

## Other gearboxes we supply
We also supply Mercedes-Benz 7G-Tronic and 9G-Tronic, Porsche PDK, Audi S tronic and DSG, Aisin and other automatic and dual-clutch gearboxes. The same advice applies: the type plate and the VIN decide the match.

## Fitting
Fitting a gearbox is a repair shop job. Allow for the fluid, the coding or adaptation of the mechatronic unit and a test drive with an adaptation run.

## Getting a quotation
Send photographs of the type plate, your VIN, the engine code and the drive type. Browse [automatic and dual-clutch gearboxes](/parts?part=gearbox), including the [ZF 8HP70](/part/zf-8hp70-automatic-gearbox), and [request a quote](/request-a-part).`,
  },
];

export const guideBy = new Map(GUIDES.map((g) => [g.slug, g]));