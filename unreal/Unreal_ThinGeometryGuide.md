## Unreal Engine 5: Thin Geometry Lighting & Nanite Workflow Guide
This document outlines the correct settings for handling thin geometry (such as modular walls and automotive panels) using Software Lumen and Nanite, preventing common artifacts like black splotches and blinding light leaks.
------------------------------
## 🚨 The Ultimate Solution: "Two-Sided" Material Toggle
When dealing with single-plane geometry, the single most important fix is using the standard material-level settings.

* The Fix: Open your material, go to the Details panel, and check Two Sided.
* The Mesh Shadow Fix: Select your actor in the viewport, search for "Shadow" in the Details panel, and check Cast Shadows as Two Sided.
* Why it works: This forces the standard rendering pipeline to treat both sides of your thin planes as solid blockers. It stops light from passing through backfaces without breaking the engine's core global illumination calculations.

------------------------------
## 🛑 The Core Trap: "Two-Sided Distance Field" Mesh Setting
Never turn on "Two-Sided Distance Field" in the Static Mesh Editor for solid objects, even if they are physically thin.

* The Misconception: Thinking "Two-Sided" makes a thin plane twice as solid or blocks light from both sides.
* The Reality: Turning this setting ON forces the engine to use Unsigned Distance Fields. This deletes the engine's ability to calculate a "solid core," turning your mesh into a porous, semi-transparent voxel cloud.
* The Result: Sunlight and ambient light treat the object like a tree canopy, ray-marching right through it and flooding your interiors with blinding light.

## The Correct Distinction:

* 🟩 Turn it OFF for anything that must block light completely (Walls, Car Body Panels, Doors, Hoods, Floors).
* 🌿 Turn it ON only for organic, porous assets where light should filter through (Trees, Grass, Leaves, Hair Cards).

------------------------------
## ⚠️ The Overlapping Geometry Trap (False Fix)

* The Scenario: You have overlapping duplicate geometry (Z-fighting), which causes ugly, pitch-black splotches because shadow rays get trapped between the faces.
* The False Fix: Turning on Two-Sided Distance Field makes the black splotches disappear, making it look like the issue is solved.
* The Reality Check: The splotches only disappeared because you turned the walls into a porous foliage screen, which disabled strict solid shadowing and let light flood right through.
* The Real Fix: Leave Two-Sided Distance Field OFF. Physically separate or delete the overlapping geometry so faces do not occupy the exact same 3D coordinates. If making a car door, ensure a tiny gap (even 1mm) exists between the outer shell and inner trim.

------------------------------
## 🛠️ Complete Setup Guides## 🚗 1. The Automotive / Thin Plane Workflow (Software Lumen)
Use these settings when you must use thin planes (like car body panels or thin modular sheets) and cannot add physical thickness to the mesh.

| Setting Name | Location | Value | Why it's needed |
|---|---|---|---|
| Two Sided | Material Editor | ON / Checked | The Primary Fix. Forces the standard viewport rasterizer to render backfaces cleanly. |
| Cast Shadows as Two Sided | Actor Details Panel | ON / Checked | The Primary Fix. Ensures point lights and sun maps cast shadows from the backface. |
| Two-Sided Distance Field | Static Mesh Editor | OFF / Unchecked | Keeps the math "Solid" so light cannot pass through the panel. |
| Distance Field Resolution Scale | Static Mesh Editor | 2.0 to 4.0 | Packs the voxel cloud tighter around the thin shape to prevent edge leaks. |
| Fallback Relative Error | Static Mesh Editor (Nanite) | 0.0 | Stops Nanite from aggressively ruining the smooth curves at a distance. |

------------------------------
## 🏠 2. The Interior Structural Workflow (Best Practice)
If you are building architecture, rooms, or modular building pieces, do not use single planes.

* The Rule: Always use meshes with actual volume (Cubes/Boxes) for walls and ceilings.
* Ideal Thickness: 10cm to 20cm.
* Why: This gives Lumen an explicit "inside" and "outside" boundary. It completely eliminates light leaks, allows Nanite to optimize clusters without creating jagged edges, and lets you use different materials on the interior (wallpaper) and exterior (brick).

------------------------------
## 🔍 Visual Troubleshooting Cheatsheet## "I see weird black splotches all over my surfaces!" (When meshes DO NOT overlap)

* The Cause: A mismatch between the shadow system and Nanite's heavily decimated "fallback mesh." The shadow ray hits a jagged, invisible proxy polygon.
* The Fix: Open the Static Mesh Editor > Go to Nanite Settings > Change Fallback Target to Percent Triangles > Set Fallback Triangle Percent to 100. Click Apply.

## "My interior point lights are leaking to the outside!"

* The Cause: The walls are single planes facing outward, and the material doesn't know how to render the inside face.
* The Fix: Ensure Two Sided is checked inside the Material Editor, and Cast Shadows as Two Sided is checked on the wall meshes in your level.

## "My smooth car panels look jagged and faceted when I move away!"

* The Cause: Nanite is over-decimating the curved geometry too early.
* The Fix: Open the Static Mesh Editor > Find Nanite Settings > Set Position Precision to -13 (High Precision), and change Fallback Relative Error to 0.0.

------------------------------
If you want to dive deeper into this project, let me know if we should tackle automotive glass setup next or move on to interior cabin lighting controls!

