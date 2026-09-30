# Pizza Bros Premium Cinematic Blueprint

## Core idea

The mascot is no longer a procedural approximation. The supplied animated character owns the first scene. Cursor movement subtly changes the character orientation and head direction. Scroll then changes the animation state from idle to walk to dash to slide while the character physically clears the stage and hands visual ownership to one persistent pizza.

## Premium visual system

The palette is near black, warm ivory, deep tomato, oxblood, saffron and basil. Bright cheap reds were removed. The lighting uses a warm food key, deep red rim, ACES tone mapping, environment reflections and controlled bloom. Surface grain is intentionally subtle.

The pizza uses high segment geometry and runtime generated textures for dough, char, sauce, cheese, pepperoni and oil variation. The oven has brick texture and bump detail. The final box uses a paper fiber texture and a stamped Pizza Bros mark.

## Story states

1. Hero Handoff: animated mascot responds to the cursor and transitions through idle, walk, dash and slide as the pizza moves forward.
2. Sauce Flight: tomato sauce forms a surreal spiral above the pizza.
3. Cheese Rain: ingredients suspend in depth and fall toward the product.
4. Topping Orbit: ingredients orbit around the pizza and close inward.
5. Oven Tunnel: the oven grows from distant architecture into a full frame environment with embers, heat and bloom.
6. Flavor Selector: the same pizza returns as a premium beauty shot with four recipes.
7. Build Your Own: top down composition and live topping feedback.
8. Order Resolution: the same pizza settles inside a branded paper box.

## Sound

The supplied Italian pizza soundtrack loops quietly at a controlled volume. The site attempts playback immediately and falls back to first user interaction when the browser blocks autoplay. The header includes a persistent sound control.

## Performance

Desktop device pixel ratio is capped at 1.75. Mobile is capped at 1.35. Particle counts are reduced on mobile. The supplied GLTF was compacted to the four animation clips actively used by the experience. Pizza and environment textures are generated locally in the browser, so there are no image texture network dependencies beyond the mascot textures.

## Accessibility

All purchase related interactions remain semantic DOM controls. Keyboard focus is visible. Reduced motion removes continuous decorative movement and uses calmer transitions. Audio always has an explicit off control.

## Model credit

Peppina Ramen Pizza Tower (Low poly) by ggoljunsa, licensed under CC BY 4.0. Full license text is included with the model asset.
