## 💎 Unreal Engine 5 Automotive: Advanced Glass & Interior Lighting Guide

## 🚘 Part 1: Automotive Glass Workflow (Software Lumen)
Standard translucent glass materials completely break Software Lumen's global illumination pipeline because light does not know how to pass through them or bounce off them correctly.
## 1. The Shading Model Fix
Do not use a standard default opaque or standard translucent shading model for car windows.

* Open your glass material.
* In the Details panel, set Shading Model to Thin Translucent.
* Change Blend Mode to Translucent.
* Under the Material details, search for Lighting Mode and set it to Surface Forward Shading. (This is critical: it forces the engine to calculate high-end specular highlights and reflections on the glass surface).

## 2. Connect the Material Nodes
To make the Thin Translucent shading model work, you must hook up the Thin Translucent Material Output node:

* Right-click in the material graph and search for Thin Translucent Material Output.
* Connect a Constant3Vector (Color) to the Transmission Color input. (Set it to a very light tint, like soft blue or light gray).
* Connect your standard inputs to the main material node: Opacity (0.1 to 0.2), Roughness (0.0), and Metallic (0.0).

## 3. Fixing the Voxel Light Leak
Because Software Lumen uses Global Distance Fields, it can get confused by thin translucent glass sheets and cause glowing light leaks inside the car cabin.

* Select your car glass static mesh inside the level.
* In the Details panel, search for Affect Distance Field Lighting.
* Uncheck this box.
* Why: This prevents the glass from casting low-resolution voxel shadows inside the car, relying instead on screen-space traces for clean, seamless transitions.

------------------------------
## 💡 Part 2: Interior Cabin Lighting Controls
Illuminating dashboard screens, buttons, and footwells inside a tightly enclosed, thin-walled car cabin requires strict control to keep the light from spilling outside the car.
## 1. Dashboard & Screen Emissives (Lumen Controls)
Small emissive materials (like glowing buttons or digital dials) can easily over-inject light into a small cabin space, causing flickering artifacts.

* Open your emissive material.
* Keep the Emissive Color multiplier reasonable (values between 1.0 and 5.0).
* If the glow is too intense or creates noise on the leather seats, select the car mesh in the world outliner, go to the Details panel, and look under Lumen Settings.
* You can adjust the Emissive Light Source Quality or use a Post Process Volume to lower the Lumen Scene Lighting Quality slightly if you see dancing white dots (fireflies).

## 2. Point Lights and Spot Lights Configuration
When placing interior lights (like dome lights or ambient footwell strips), prevent them from clipping through your thin panels using these exact parameters:

| Setting Name | Location | Value | Why it's needed |
|---|---|---|---|
| Cast Shadows | Light Details | ON / Checked | Crucial. If turned off, light will instantly pass through the dashboard and floors. |
| Source Radius | Light Details | 2.0 to 5.0 | Softens the shadow edges inside the cabin, hiding low-poly interior geometry limitations. |
| Inverse Square Falloff | Light Details | ON / Checked | Forces the light to decay physically and realistically over short distances. |
| Attenuation Radius | Light Details | Keep it Small | Limit the radius so it physically cannot reach past the exterior car doors. |

## 3. Eliminate "Shadow Acne" on Tiny Interior Parts
Car interiors have small buttons, levers, and air vents. Thin light rays can create jagged, vibrating shadow artifacts on these parts.

* Select your interior lights (Point/Spot).
* Expand the Shadow settings in the Details panel.
* Set Shadow Bias to a slightly higher value (around 0.03 to 0.05) to push the shadow boundary smoothly off the microscopic polygons.

------------------------------
Now that the complete lighting, glass, and shadow pipelines are optimized, we can finalize the presentation. If you want, tell me if you are running into wobbly or pixelated reflections on the car paint so we can look at Nanite precision settings, or if you want to move straight to studio backdrops!

