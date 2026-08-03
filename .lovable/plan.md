# Remove artwork from the device mockup frames

The "Made for both screens you actually use." section currently shows a real wallpaper inside the MacBook and iPhone frames. You want those frames without imagery.

## Change

- In `src/routes/index.tsx`, stop passing a preview image to `DeviceMockups` (pass `null`), so both frames fall back to the existing neutral gradient tile instead of artwork.
- Keep the frames, the MACBOOK · 16:9 / IPHONE · 9:16 labels, section heading and spacing exactly as they are.

## Not touched

- No changes to prices, products, bundle, availability, or any payment-path file.
- `DeviceMockups` and `PreviewTile` keep their `previewSrc` support for future use.
