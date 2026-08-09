# The Ultimate Unreal Engine 5 Distance Fields & Lumen Reference Guide

## Part 1: Distance Fields (Where Things Are)
Distance Fields are volumetric, 3D representations of your scene's geometry. They do not store polygons; instead, they store Signed Distance Field (SDF) data—a grid of points where each point knows its distance to the closest surface of a mesh. They act as the "invisible roadmap" that light rays travel through.
## 1. Individual Distance Fields (Mesh Distance Fields / MDFs)

* What they are: High-resolution, per-object 3D volumetric "clouds" generated in the background for individual static meshes.
* Accuracy: Very high. They match the fine details and exact contours of the asset geometry.
* Reach & Range: Localized directly around the asset itself.
* Performance Cost: Computations are intensive, making them expensive for the GPU to evaluate at vast distances. They are generally restricted to objects near the camera.
* Primary Job: Powers close-up Software Lumen tracing (Detail Tracing within the first 2 meters of a ray), sharp localized contact shadows, and advanced material shader calculations.
* How to Visualize: In the level viewport, click Show > Visualize > Mesh Distance Fields.
* How to Increase Quality:
   * The Setting: Open the asset in the Static Mesh Editor and change Distance Field Resolution Scale.
   * Default Value: 1.0
   * Quality / Sweet Spot: 2.0 to 3.0 for highly detailed props, thin walls, or assets causing light leaks. (Avoid going above 4.0 as it balloons project disk space and memory).

## 2. Global Distance Field

* What it is: A single, massive, low-resolution composite volume texture that combines all individual mesh distance fields in the scene into camera-centered clipmaps that follow the player.
* Accuracy: Low to medium. Small props can disappear, and separate meshes often blend or bleed together.
* Reach & Range: Scene-wide coverage stretching out to hundreds of meters (up to a project-defined maximum clipmap limit, e.g., 200m).
* Performance Cost: Highly optimized, incredibly cheap to compute, and very fast for light rays to traverse.
* Primary Job: Powers background Software Lumen ray transitions (past 2 meters) [Lumen Technical Details in Unreal Engine], long-range global illumination bounces, Distance Field Ambient Occlusion (DFAO), Sky Light shadowing, and Niagara particle collisions.
* How to Visualize: In the level viewport, click Show > Visualize > Global Distance Field.
* How to Increase Quality:
   * The Setting: Go to Project Settings > Rendering > Lighting and adjust Distance Field Voxel Density.
   * Default Value: 0.2
   * Quality / Sweet Spot: 0.2 to 0.3. This sharpens the broader background clipmap so that distant global illumination and sky shadows look significantly less blocky.

## 3. The Special Mesh Exceptions
Unreal Engine generates distance fields automatically for standard static meshes, but handles these categories differently:

* Landscapes: Landscapes do not get individual Mesh Distance Fields. Instead, the engine injects them directly into the Global Distance Field using a specialized, ultra-fast heightfield system.
* Skeletal Meshes: Morphing, deforming, or animating characters do not generate distance fields by default (calculating moving volumes in real-time is too heavy). They bypass distance field GI and instead sample local lighting using an invisible grid of floating probes called Volumetric Lightmaps.
* World Position Offset (WPO): For meshes using materials that simulate wind or foliage waving (WPO), the distance fields and surface cache remain completely static in the mesh's resting shape. If a tree trunk bends 3 meters in a storm shader, its distance field stays behind, which can cause ghosting shadows unless explicitly adjusted.
* Single-Sided Planes: Standard engine planes have zero thickness. Because Signed Distance Fields require a defined "inside" and "outside" to calculate mathematical signs correctly, the generator fails on a default plane—leaving it invisible or glitched. You must check Two-Sided Distance Field in the asset editor to force the engine to mirror distance values on both sides, or use a mesh with true physical thickness.

------------------------------
## Part 2: Surface Cache & Lumen Cards (What Things Look Like)
While Distance Fields tell light rays where objects are, the Surface Cache and Lumen Cards tell rays what color and material properties exist at the point of impact.

[Ray Fired] ---> [Distance Field / Hardware BVH checks WHERE the hit is]
                     ↓
                 [Hit Registered]
                     ↓
                 [Lumen Cards evaluate WHAT color/light is at that spot]
                     ↓
                 [Surface Cache returns material data] ---> [Light Bounces]

## 1. Mesh Lumen Cards

* The Concept: Think of Lumen Cards as flat, automatic "cardboard cameras" or bounding projection boxes wrapped around your 3D models.
* The Workflow: By default, the engine places up to 12 cards around a mesh (Front, Back, Left, Right, Top, Bottom, etc.) to take flat snapshots of its colors and textures from multiple angles.
* The Core Fix: If an asset has a complex, hollow, or coiled structure (like a spiral staircase or a house with rooms), the default 12 cards can't see into the interior crevices, creating blind spots. This results in ugly black patches or severe light leaks in your game. Increasing Max Lumen Mesh Cards (e.g., to 24 or 32) in the asset editor gives the engine more angles to map complex geometry cleanly [Lumen Technical Details in Unreal Engine].

## 2. The Surface Cache

* The Concept: A flat atlas compilation of all the 2D snapshots taken by the Lumen Cards, pre-baked with lighting information.
* The Workflow: When a ray hits a surface, running a full, heavy material shader at the intersection point is too computationally demanding. Instead, the ray reads the flat pixel data directly from the Surface Cache to instantly determine how much light and color should bounce off that surface.
* The Core Fix: If your global illumination or reflections appear blurry, blocky, or low-resolution, your Surface Cache lacks pixel density. Increasing Lumen Scene Detail forces the engine to allot more texture memory to the cache, resulting in sharper lighting data.
* How to Visualize: In the level viewport, click Lit > Lumen > Surface Cache or Mesh Cards.
* How to Increase Quality (Resolution):
 * The Setting: Add a Post Process Volume to your level, ensure Infinite Extent (Unbound) is checked, and increase Lumen Scene Detail.
 * Default Value: 1.0
 * Quality / Sweet Spot: 1.5 to 2.0. This forces the engine to allot more texture memory to the cache, resolving blurry global illumination or low-resolution reflections.

------------------------------
## Part 3: Ray Tracing Pipelines & Core Settings
Unreal Engine 5 handles these foundational structures differently based on whether you run Software or Hardware Ray Tracing.
## 1. Software Ray Tracing

* How it works: Software mode treats your world as an approximation. It completely ignores individual polygon triangles for lighting and relies entirely on distance fields.
* Mesh Distance Fields: Used exclusively for close-ups. Within the first 2 meters of a ray hitting an object, it reads high-resolution individual fields for precise shadows and reflections [Lumen Technical Details in Unreal Engine].
* Global Distance Field: Used for long-range navigation. Past 2 meters, the ray transitions to the cheap Global Distance Field to move through the rest of the level without dropping frames [Lumen Technical Details in Unreal Engine].
* Surface Cache: Used at every hit location across the map to sample reflection and global illumination color data [Lumen Technical Details in Unreal Engine].

## 2. Hardware Ray Tracing

* How it works: Utilizes the dedicated RT cores on modern graphics cards (Nvidia RTX / AMD Radeon) to trace rays against actual polygon geometry (Nanite fallback meshes or low-poly proxies).
* Mesh Distance Fields: Completely ignored for lighting calculations. Hardware cores calculate physical triangle intersections instead. (Note: You still need Mesh Distance Fields enabled in project settings if your water shaders use shore foam, your materials use distance-based glows, or Niagara particles use distance field collision).
* Global Distance Field: Still required for Far Field calculations. Because tracing billions of polygons across an open world will crash any GPU, Hardware RT only traces geometry within a local radius (typically 20–40 meters). Past that range, it switches to the Global Distance Field for performance-friendly background bounces [Lumen Technical Details in Unreal Engine].
* Surface Cache: Highly utilized. Even though Hardware RT finds an intersection on a real polygon, it still queries the Surface Cache at that point to get color data, bypassing heavy material shader recalculations [Lumen Technical Details in Unreal Engine].

## 3. Core Lighting Settings Explained

* Lumen Scene Detail: Dictates what objects bounce light. It functions as an object-size filter for the Surface Cache. Low values drop small props (chairs, lamps) from the cache to save memory. High values capture tiny objects, ensuring a small red prop accurately bounces red light onto surrounding walls.
* Lumen Final Gather Quality: Dictates how clean and stable the bounced light looks. Ray tracing samples lighting sparsely and relies on a "Final Gather" denoising filter to smooth the results. Low values shoot few rays, causing dark corners to flicker with grainy noise. High values shoot many rays, creating smooth, stable, cinematic illumination at a flat cost to your baseline FPS.

------------------------------
## Part 4: Complete Master Configuration Matrix
Use these curated setting combinations depending on your project's performance and hardware targets.
## 🟢 Software Ray Tracing Profiles
## A. Max Quality (Cinematic / High-End PC)

* Shadow Method: Virtual Shadow Maps (VSM) — Infinite-resolution virtual shadow maps that eliminate all jagged shadow edges.
* Software Ray Tracing Mode: Detail Tracing — Traces individual high-res mesh fields up close for sharp contact shadows [Lumen Technical Details in Unreal Engine].
* Lumen Scene Detail: 2.0 — Sharpens the Surface Cache texture resolution to capture tiny props.
* Lumen Final Gather Quality: 2.0 to 4.0 — Maximizes ray density to eliminate all grain, noise, and flickering.
* Manual Adjustment: Open critical hero assets in the Static Mesh Editor and manually raise their Distance Field Resolution Scale to 2.0 or 3.0 [Lumen Technical Details in Unreal Engine].

## B. The Sweet Spot (Consoles like PS5 / Mid-Range 60 FPS Target)

* Shadow Method: Virtual Shadow Maps (VSM).
* Software Ray Tracing Mode: Detail Tracing — Retains tight contact accuracy right where props touch floors [Lumen Technical Details in Unreal Engine].
* Lumen Scene Detail: 1.0 — Balanced Surface Cache layout; provides great coverage without overloading VRAM.
* Lumen Final Gather Quality: 1.0 — Production-standard ray count for stable illumination.
* Project Scaling: Leave Distance Field Voxel Density at its project default (0.1).

## C. Max Performance (Steam Deck / Low-End PCs)

* Shadow Method: Traditional Shadow Maps (Cascaded Shadow Maps / CSM) — Bypasses VSM to recover immense virtual texture memory and processing power.
* Software Ray Tracing Mode: Global Tracing — Skips individual mesh fields entirely and traces only the low-resolution Global Distance Field [Lumen Technical Details in Unreal Engine]. This gives a massive frame-rate boost, but contact shadows under small props will look soft or slightly detached.
* Lumen Scene Detail: 0.5 — Drops small props out of the GI pipeline to save memory.
* Lumen Final Gather Quality: 0.5 — Reduces ray counts; lighting may flicker slightly, but baseline FPS recovers heavily.
* Lumen Scene View Distance: Reduce to 5000 or 10000 (50–100 meters) to stop distant background cache calculations.

------------------------------
## 🔵 Hardware Ray Tracing Profiles
## A. Max Quality (Next-Gen Absolute Best Visuals)

* Shadow Method: Virtual Shadow Maps (VSM) — Delivers highly realistic shadow penumbras that naturally soften over distance.
* Ray Tracing Quality: High — Forces hardware rays to trace against full, uncompressed Nanite detail geometry.
* Lumen Ray Lighting Mode: Hit Lighting for Reflections — Bypasses the Surface Cache for reflections entirely, executing full, heavy material shaders at the exact ray hit location for mirror-perfect clarity.
* Lumen Scene Detail: 2.0.
* Lumen Final Gather Quality: 2.0 to 4.0.

## B. The Sweet Spot (High-End Consoles & Mid-to-High PC)

* Shadow Method: Virtual Shadow Maps (VSM).
* Ray Tracing Quality: Normal — Hardware rays trace against highly optimized Nanite fallback/proxy meshes instead of full polygons, running twice as fast while looking 95% as clean.
* Lumen Ray Lighting Mode: Surface Cache — Traces real geometry to find intersection locations, but instantly reads the cheap Surface Cache for color to avoid heavy material costs [Lumen Technical Details in Unreal Engine].
* Lumen Scene View Distance: 10000 to 20000 (100–200 meters) — Traces hardware geometry locally, then smoothly handshakes over to the Global Distance Field for the distant background to preserve performance [Lumen Technical Details in Unreal Engine].
* Lumen Scene Detail: 1.0.
* Lumen Final Gather Quality: 1.0.

## C. Max Performance (Budget RT Graphics Cards)

* Shadow Method: Traditional Shadow Maps — Frees up vital VRAM needed to build hardware ray-tracing acceleration structures.
* Ray Tracing Quality: Normal.
* Lumen Ray Lighting Mode: Surface Cache [Lumen Technical Details in Unreal Engine].
* Lumen Scene Detail: 0.5.
* Lumen Final Gather Quality: 0.5.
* Lumen Scene View Distance: Drop to 5000 (50 meters) to forcefully limit hardware ray tracing to the immediate area around the player.

------------------------------
## Part 5: Step-by-Step Action Plan: Configuring For Software Quality
If your goal is to lock in maximum quality using Software Ray Tracing, follow this precise setup order in the engine:
## Step 1: Disable Hardware Ray Tracing Completely
To prevent the engine from seeking out hardware RT cores and ensure it uses your distance fields cleanly:

   1. Go to Edit > Project Settings.
   2. Search for Support Hardware Ray Tracing and uncheck it.
   3. Search for Use Hardware Ray Tracing when available and uncheck it.
   4. Restart the engine when prompted to clear out the graphics pipeline shaders.

## Step 2: Set the Base Software Pipeline Settings

   1. In Project Settings, search for Shadow Map Method and ensure it is set to Virtual Shadow Maps (VSM).
   2. Search for Software Ray Tracing Mode and set it to Detail Tracing [Lumen Technical Details in Unreal Engine].

## Step 3: Sharp-Tune Individual Mesh Quality
For meshes close to the player or critical architectural walls that leak light:

   1. Double-click the asset to open the Static Mesh Editor.
   2. In the Details panel, search for Distance Field Resolution Scale.
   3. Increase the value from 1.0 to 2.0 or 3.0 depending on asset complexity.
   4. Click Apply Changes.
   5. (Optional) If the mesh is a thin wall or flat sheet, look for and check the box for Two-Sided Distance Field.

## Step 4: Sharp-Tune Global Background Quality
To stop the broad, distant global illumination and background reflections from looking chunky:

   1. Go to Project Settings > Rendering > Lighting.
   2. Find Distance Field Voxel Density.
   3. Scale this up slightly from 0.1 to 0.2 or 0.3.
   4. Note: Let the loading bar in the bottom right corner ("Compiling Distance Fields") finish processing entirely before testing your frame rate.

------------------------------
## Part 6: Quick Diagnostic Troubleshooting Flowchart

* Issue: There are black blocks/holes appearing inside my reflections or global illumination.
* Cause: Your Lumen Cards cannot see inside a complex mesh cavity.
   * Fix: Open the mesh asset editor, search for Max Lumen Mesh Cards, and raise the value to 24 or 32 [Lumen Technical Details in Unreal Engine].
* Issue: Light is visibly leaking through solid walls or bleeding around thin floors.
* Cause: The mesh distance field is too thin or low-resolution, allowing the ray to pass through before registering a hit.
   * Fix: Raise the Distance Field Resolution Scale on that specific mesh, or turn on Two-Sided Distance Field.
* Issue: Shadows look beautiful when I stand still, but they crawl with a noisy, grainy "ant" pattern when I look around.
* Cause: Your ray count is too low for the denoiser to handle cleanly.
   * Fix: Add a Post Process Volume, make sure Infinite Extent (Unbound) is checked, and raise Lumen Final Gather Quality to 2.0.
* Issue: My game stutters or drops frames like crazy whenever I quickly whip my camera around.
* Cause: The engine is constantly unloading and loading thousands of high-res textures into the Surface Cache.
   * Fix: Lower your Lumen Scene Detail slider in your Post Process Volume closer to 1.0 or 0.5 to prioritize performance.

------------------------------

