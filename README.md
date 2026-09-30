# Pizza Bros Surreal Cinematic Site

Premium Three.js rebuild of Pizza Bros.

## What changed

* Replaced the procedural mascot with the supplied Peppina Ramen Pizza Tower animated GLTF model.
* Uses four supplied animation clips: idle motion, walk, dash and slide.
* Added cursor responsive mascot motion and head tracking in the hero.
* Rebuilt the pizza with high segment geometry, procedural dough, sauce, cheese, pepperoni, paper and brick textures, plus physical materials.
* Added a persistent pizza story through sauce, ingredient storm, oven tunnel, flavor selection, custom toppings and final boxing.
* Added ACES tone mapping, environment reflections, atmospheric particles, surreal portal rings and bloom.
* Added the supplied Italian pizza soundtrack. Browsers that block autoplay start it on the first user interaction. A sound control remains visible in the header.
* Added accessible flavor, topping, quantity, menu and sound controls.
* Added mobile composition and reduced motion behavior.

## Run locally

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

The project is Vite and Vercel compatible.

## Mascot license

This work uses "Peppina Ramen Pizza Tower (Low poly)" by ggoljunsa under CC BY 4.0. The complete source credit and license text are included at `public/assets/mascot/LICENSE-MODEL.txt` and a compact credit is shown in the website footer.
