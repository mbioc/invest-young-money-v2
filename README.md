# Invest Young Money V2 preview

This is a separate design exploration copied from `site/`. It does not modify the current site, the AI Studio project, or the GitHub connected version.

## Preview locally

From the workspace root:

```powershell
python -m http.server 8766 --directory site-v2
```

Open `http://localhost:8766/index.html`.

## Design and motion

- The Home hero cycles through still images and has a visitor controlled pause button. The first image is a generated editorial business learning scene, not a real Invest Young Money event. Natelya Hale's supplied portrait appears later in the loop. Motion stops when reduced motion is preferred.
- The Home hero card now previews a calculator entry form. It validates name, email, and phone, then opens the existing GoHighLevel calculator. The preview does not store or submit those details. Connect a real HighLevel form and configure its successful submission to redirect to the calculator before publishing a lead capture flow.
- The V2 editorial layout takes its visual pacing from the Bobbin reference: a full-bleed media hero with a floating information card, wide centered statements, a horizontal resource selector, alternating open and high-contrast section bands, and a simplified closing section. All visible words, destinations, brand colors, and Sora/Assistant typography remain Invest Young Money's.
- `v2.css` provides the V2 visual system across all copied routes. `home-renew.css` replaces the Home page layout from hero through closing section. `v2.js` handles the image loop and calculator entry. The original `styles.css`, `pages.css`, `script.js`, page copy, links, catalog data, and assets are copied into this folder for an independent preview.
- The 47 draft HTML pages are set to `noindex, nofollow` during review.

## Before replacing the current site

Review page copy and imagery with Natelya, test the contact and booking flows in the target account, confirm product and checkout connections, and update the draft robots directives and canonical URLs for the production domain. The existing integration caveats in `site/` remain relevant to this static preview.
