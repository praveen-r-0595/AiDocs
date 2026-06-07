
------------------------------
## 🕹️ Part 1: The Hardware Ray Tracing (HW RT) Pipeline Guide
Use this pipeline if your target platform is high-end PCs (RTX 3080/RX 6800 or better) and current-generation consoles (PS5/Xbox Series X) where physical RT cores are available.
## Profile A: Cinematic / Ultra Quality Profile

* Target Outcome: Zero compromises, mirror-like metallic/clear-coat finishes, pixel-perfect macro shadowing, and perfect interior cabin occlusion. Ideal for premium desktop car configurators, ArchViz, or 30 FPS cinematic game modes.

## ⚙️ Critical Settings & Overrides

* Lumen Ray Lighting Mode: Set to Hit Lighting. (This bypasses the low-res surface cache completely and forces the engine to run full material, textures, and shading math at the exact ray intersection point—essential for high-end car paint and glass specular highlights).
* r.RayTracing.Nanite.Mode 1: Forces Hardware Ray Tracing to trace directly against native, high-poly streaming Nanite triangles rather than proxy meshes [r.RayTracing.Nanite.Mode 1]. This completely eradicates any shadow or reflection "faceting" and removes black splotches on curved meshes like eyeballs or car panels [r.RayTracing.Nanite.Mode 1].
* r.RayTracing.NormalBias 1.5: Pushes the ray origin 1.5 cm off surfaces along the normal vector, preventing self-shadowing precision errors in tight, overlapping crevices.

## 📄 Configuration Block (DefaultEngine.ini)

[/Script/Engine.RendererSettings]
r.Lumen.HardwareRayTracing=1
r.Lumen.HardwareRayTracing.LightingMode=1
r.RayTracing.Nanite.Mode=1
r.RayTracing.NormalBias=1.5
r.Shadow.Virtual.Enable=1

------------------------------
## Profile B: Optimized Performance Profile

* Target Outcome: High-fidelity ray-traced reflections and global illumination running at a stable 60+ FPS on target hardware.

## ⚙️ Critical Settings & Overrides

* Lumen Ray Lighting Mode: Set to Surface Cache. (This forces the engine to look up pre-calculated lighting cards for rays, cutting your ray tracing cost in half while keeping global illumination intact).
* r.RayTracing.Nanite.Mode 0: Reverts the ray tracer back to testing against the optimized Nanite Fallback Mesh to protect your framerate [r.RayTracing.Nanite.Mode 0].
* Asset-Level Proxy Fix: To stop the black splotches caused by Mode 0 without killing performance, open breaking curved assets (like characters/car body shapes) in the Static Mesh Editor, change Fallback Target to Percent Triangles, and set the Fallback Triangle Percent to 100. This isolates the high-detail proxy fix only to the breaking meshes.
* The Hybrid Shadow Loophole: Ensure Cast Ray Traced Shadows is DISABLED on all lights. Use Virtual Shadow Maps (VSM) instead. VSMs read native Nanite perfectly, meaning you get sharp shadows without tracing expensive shadow paths on your GPU cores.

## 📄 Configuration Block (DefaultEngine.ini)

[/Script/Engine.RendererSettings]
r.Lumen.HardwareRayTracing=1
r.Lumen.HardwareRayTracing.LightingMode=0
r.RayTracing.Nanite.Mode=0
r.RayTracing.NormalBias=2.0
r.Shadow.Virtual.Enable=1

------------------------------
## ✅ The Hardware Ray Tracing Production Checklist

* Project Settings Check: Support Hardware Ray Tracing is enabled, and Lumen Reflection/GI is set to Hardware.
* The Shadow Rule: Standalone Cast Ray Traced Shadows is turned OFF globally and on individual lights; Virtual Shadow Maps is the active shadow method.
* Asset Fallback Audit: For Performance Profiles, all curved/critical assets have their asset-level Fallback Triangle Percent manually set to 100.
* Material Validation: Any thin, single-plane panel has Two Sided checked inside its Material Editor parameters to prevent reflection light leaks.

------------------------------
## 💻 Part 2: The Software Ray Tracing (SW RT) Pipeline Guide
Use this pipeline if your target platform includes mid-range PCs, Steam Deck, web streaming, pixel streaming, or competitive multiplayer games where physical RT hardware overhead must be completely avoided.
## Profile A: High Quality Profile

* Target Outcome: Pristine global illumination and rich, dark interior spaces using purely software distance fields and screen-space information.

## ⚙️ Critical Settings & Overrides

* Distance Field Resolution Scale: Set between 2.0 and 4.0 on all thin panels (walls, car sheet metal) in the Static Mesh Editor. This generates a thick, airtight cloud of voxels around thin planes so light cannot leak through seams.
* Two-Sided Distance Field: Firmly OFF on all structural/solid assets. Leaving it off preserves solid Signed Distance Field math, keeping your interior rooms and car cabins pitch black.
* Tuning VSM for Crispness: To make Software shadows match the razor-sharp contrast of Ray Tracing, select your Directional Light and set the Source Angle to 0.0. Run these commands to drop soft shadow filtering:

r.Shadow.Virtual.SMRT.RayCountDirectional 0
r.Shadow.Virtual.SMRT.RayCountLocal 0


## 📄 Configuration Block (DefaultEngine.ini)

[/Script/Engine.RendererSettings]
r.Lumen.HardwareRayTracing=0
r.Shadow.Virtual.Enable=1
r.Shadow.Virtual.SMRT.RayCountDirectional=0
r.Shadow.Virtual.SMRT.RayCountLocal=0

------------------------------
## Profile B: Scaled Performance Profile

* Target Outcome: Maximum frame rates on lower-end hardware while avoiding edge flashing or geometric light leakage.

## ⚙️ Critical Settings & Overrides

* Screen Trace Bias 1.0: Inside your unbound Post Process Volume, locate the Lumen Global Illumination settings and set the Screen Trace Bias to 1.0. This stops software reflection rays from clipping into the thin walls as the player moves the camera quickly.
* Shadow Architecture: Keep Virtual Shadow Maps enabled but increase performance by adjusting the detail bias if needed, while ensuring all lights have an explicitly clamped radius to prevent unnecessary voxel updates.
* The Production Safeguard Box: For critical interior zones (like a dark room or the inside of a car cabin), build a thick 3D cube shell outside the geometry via Modeling Mode (Shift + 5). Uncheck Visible and check Cast Hidden Shadow. This completely blocks external sunlight before it can strike and leak through your thin software planes.

## 📄 Configuration Block (DefaultEngine.ini)

[/Script/Engine.RendererSettings]
r.Lumen.HardwareRayTracing=0
r.Shadow.Virtual.Enable=1
r.LumenScene.DirectLighting.HardwareRayTracing=0

------------------------------
## ✅ The Software Ray Tracing Production Checklist

* The Golden Mesh Rule: Two-Sided Distance Field generation is turned OFF across all solid walls and vehicle assets so they don't act like porous foliage cards.
* Material Baseline: Every single-plane material has Two Sided enabled in the Material Editor, and actors have Cast Shadows as Two Sided checked.
* Seam Inspection: Distance Field Resolution Scale is upscaled to 3.0+ on any thin modular meshes showing light leaks at the corners.
* Geometry Audit: Overlapping duplicate faces (Z-fighting) have been physically removed or separated by a 1mm gap to prevent shadow rendering bugs.

------------------------------
Would you like to expand either section with specific profiling guidelines using the stat gpu command to track down performance costs, or are you ready to save this out as your master configuration document?

