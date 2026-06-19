# Unreal Engine 5: Initial Project Setup & Rendering Architecture Specification

> **The Golden Rule of Project Setup:** Rendering settings and architectural constraints must **always** be established before any other development work begins. Modifying core rendering, geometry, or shading pipelines mid-project alters how materials, lights, and meshes interact, resulting in breaking visuals and massive asset rework.

---

## Phase 1: The Project Browser & Core Settings

When launching a new project from the Epic Games Launcher, establish your template foundation and project DNA in the Project Browser.

### 1. Template Selection
* **Blank:** Best for clean slates where you plan to engineer custom systems from scratch without boilerplate code.
* **Feature Templates (Third Person, First Person, VR):** Recommended to jump-start development with a pre-configured, standard character controller, camera setup, and input mapping.

### 2. Core Project Configuration
Configure these baseline parameters before clicking **Create**:

| Setting | Selection | Strategic Context |
| :--- | :--- | :--- |
| **Development Language** | **Blueprint** or **C++** | Selecting Blueprint does not lock you out of C++ later (and vice versa). If unsure, launch with Blueprint. |
| **Target Platform** | **Desktop** or **Mobile** | Use **Desktop** for PC/Console development. Use **Mobile** if optimizing for mobile chips or standalone VR hardware (e.g., Meta Quest). |
| **Quality Preset** | **Maximum** or **Scalable** | **Maximum** initializes Lumen and Nanite automatically. **Scalable** disables heavy features to preserve performance on lower-end targets. |
| **Starter Content** | **Checked** or **Unchecked** | **Check** for early prototyping assets (basic materials/sounds). **Uncheck** to keep the core repository file size clean and lightweight. |
| **Ray Tracing** | **Unchecked** | Keep this unchecked during initialization. You will explicitly configure your ray-tracing architecture inside the project settings. |

---

## Phase 2: Ray Tracing Architecture (HRT vs. SRT)

Your project's hardware compatibility baseline and visual ceiling are defined by choosing between **Hardware Ray Tracing (HRT)** and **Software Ray Tracing (SRT)**. This decision must align perfectly with your target audience's hardware and your game's genre.

### 1. Hardware Ray Tracing (HRT)
HRT utilizes dedicated RT cores on modern graphics cards to evaluate rays against actual geometry or Nanite proxy meshes.

* **Surface Cache Mode:** Lumen evaluates lighting on a simplified cache of the scene's surfaces.
    * **Target Project Types:** Current-gen console games (PS5, Xbox Series X), mainstream mid-to-high tier PC games, open-world action-adventure titles, and multiplayer shooters aiming for a stable 60 FPS.
    * **When to use:** Use this when you want next-gen dynamic bounce lighting and real-time day/night cycles, but still need to optimize heavily for consumer-grade hardware. It provides 90% of the visual fidelity of full ray tracing at a fraction of the performance cost.
* **Hit Lighting Mode:** Rays bypass the surface cache and evaluate full, complex materials directly at the exact intersection point.
    * **Target Project Types:** Architectural Visualization (ArchViz), automotive configurators, linear cinematics, virtual production/film, and elite, cutting-edge "overdrive" graphic modes for enthusiast PCs.
    * **When to use:** Use this when visual perfection overrides frame rate concerns. It is absolutely required if your scene relies heavily on complex multi-layered materials, highly metallic surfaces, true glass refraction, clear-coat car paint, or translucent material reflections that Surface Cache cannot physically resolve accurately.

### 2. Software Ray Tracing (SRT)
SRT eliminates specialized hardware requirements, running on a broad spectrum of legacy and mid-tier GPUs by tracing rays against **Signed Distance Fields (SDFs)**.

* **Detail Tracing Mode:** Traces rays against individual Mesh Distance Fields (MDF) for the first 2 meters of a ray for high-accuracy shadowing, before dropping back to the Global Distance Field.
    * **Target Project Types:** Cross-generation games (targeting older cards like the GTX 10-series/RX 5000-series), AA or indie titles targeting a broad PC audience, and highly stylized games (e.g., stylized RPGs, cell-shaded platformers).
    * **When to use:** Use this if your game relies on high-quality, tight ambient occlusion and sharp shadows close to structures, but you cannot guarantee your player base will own an RT-capable graphics card. It gives excellent localized grounding to objects without hardware locks.
* **Global Tracing Mode:** Skips individual mesh tracing entirely, evaluating rays exclusively against the lower-resolution, merged Global Distance Field.
    * **Target Project Types:** Massive, fast-paced open-world games (like survival games or driving games), competitive multiplayer esports titles, or low-end laptop/PC target markets.
    * **When to use:** Use this when performance stability and VRAM conservation completely override the need for micro-occlusion details. If your players are moving through the world at high speeds, they won't notice the slight loss of contact shadows under small rocks or debris, but they *will* notice the massive frame rate boost.

---

### Summary Matrix: Which Project Uses Which?

| Project Archetype | Recommended Path | Sub-Setting | Distance Fields? |
| :--- | :--- | :--- | :--- |
| **Cinematics / ArchViz / Luxury Retail** | Hardware Ray Tracing | **Hit Lighting** | Enabled (Fallback) |
| **AA/AAA Current-Gen PC & Console Game** | Hardware Ray Tracing | **Surface Cache** | Enabled (Fallback) |
| **Mass-Market Indie / Stylized Game** | Software Ray Tracing | **Detail Tracing** | **Enabled (Required)** |
| **Fast-Paced Open World / Low-End Target** | Software Ray Tracing | **Global Tracing** | **DISABLED (Turn Off)** |

### Mesh Distance Field (MDF) Optimization Rule
Unreal Engine generates Mesh Distance Fields offline for every static mesh, which costs disk space, memory, and increases load times.
* **The Rule:** If your project configuration ensures that you are **not using Detail Tracing** (meaning you run pure HRT, pure Global Tracing, or have disabled Lumen entirely), go to **Project Settings > Rendering** and uncheck **Generate Mesh Distance Fields**.
* **The Benefit:** Turning this off reclaims vast amounts of system memory, shrinks the final build size significantly, and stops the engine from spending hours compiling distance fields every time you import new asset packs.

### Mesh Distance Field (MDF) Optimization Rule
Unreal Engine generates Mesh Distance Fields offline for every static mesh, which costs disk space, memory, and increases load times.
* **The Rule:** If your project configuration ensures that you are **not using Detail Tracing** (meaning you run pure HRT, pure Global Tracing, or have disabled Lumen entirely), go to **Project Settings > Rendering** and uncheck **Generate Mesh Distance Fields**.
* **The Benefit:** Turning this off reclaims system memory, shrinks the final build size, and stops the engine from spending hours compiling distance fields.

---

## Phase 3: Core Geometry, Shadows, & Anti-Aliasing

Align your fundamental geometry rendering pipeline with your shadow and image-reconstruction software stack.

* **Nanite (Enabled / Disabled):** Keep **Enabled** for modern, high-fidelity pipelines. It removes poly-count limitations and traditional LOD baking pipelines. Disable *only* if targeting mobile/web platforms or building traditional, flat 2D experiences.
* **Virtual Shadow Maps (VSM) (Enabled / Disabled):** Leave **Enabled** if Nanite is active. VSM delivers highly detailed shadows that perfectly match Nanite's microscopic geometry details without the massive performance overhead of classic cascaded shadow maps.
* **Anti-Aliasing Method (TSR vs. TAA):**
  * **TSR (Temporal Super Resolution):** Epic's native next-gen upscaler. Choose this to preserve sub-pixel details and thin geometry while rendering at lower internal screen percentages to save frame time.
  * **TAA (Temporal Anti-Aliasing):** Delivers a softer image footprint. Choose this if your gameplay style features hyper-fast screen motion where TSR's temporal ghosting artifacting becomes distracting, or if you prefer a traditional sharp look.

---

## Phase 4: Advanced Shading & Pipeline Infrastructure

These four architectural settings dictate how materials, shaders, and system APIs communicate. Changing them mid-development forces full project re-compiles.

### 1. Shading Path: Deferred vs. Forward
* **Deferred Shading (Default):** Handles hundreds of dynamic lights natively and is required for features like Lumen, Nanite, and screen-space post effects. Use for standard desktop and console titles.
* **Forward Shading:** Offers superior GPU performance and supports high-quality **MSAA (Multisample Anti-Aliasing)**, but heavily restricts dynamic lighting and disables Lumen. Use for **Virtual Reality (VR)** projects or low-end mobile targeting high framerates.

### 2. Material Framework: Substrate Architecture
* Go to **Project Settings > Rendering > Substrate** to toggle between frameworks.
* **Substrate Enabled:** Replaces the legacy material input stack with a modular, physically accurate framework based on "Slabs" and "Closures" for highly complex, multi-layered surfaces (e.g., liquid over rust, realistic skin, or deep car clear coats).
* **Legacy Materials:** Uses the standard Base Color, Metallic, Roughness inputs.
* *Note:* Decide this choice at launch. Converting a legacy master material to Substrate later can cause irreversible node breakage.

### 3. Texture Pipeline: Virtual Texturing (SVT & RVT)
Go to **Project Settings > Rendering > Virtual Textures** and enable support.
* **Streaming Virtual Textures (SVT):** Slices high-resolution textures (8K+) into small tiles, loading only what is visible in the viewport to safeguard VRAM.
* **Runtime Virtual Textures (RVT):** Dynamically bakes your landscape data into memory, allowing static meshes (like rocks and cliffs) to organically blend their edges into the terrain material. 
* *Note:* Your landscape and master materials must be built from day one with Virtual Texture samplers to function.

### 4. Target RHI (Render Hardware Interface)
Go to **Project Settings > Platforms > Windows > Target RHIs**.
* Set your Default RHI to **DirectX 12 (SM6)** to access Nanite, Lumen, Hardware Ray Tracing, and Virtual Shadow Maps on Windows platforms.

---

## Phase 5: Viewport Control & Global Post-Processing

Stabilize your visual environment inside your first saved level to prevent the engine's default camera behaviors from interfering with asset placement and lighting pass design.

### 1. The Global Post Process Volume (PPV)
1. Drag a **Post Process Volume** into your empty level.
2. In its Details panel, search for **Unbound** and check **Infinite Extent (Unbound)** to make its effects globally apply across the entire world map.
3. Configure these baseline overrides to stabilize the viewport:
   * **Exposure:** Expand *Lens > Exposure*. Check **Min Brightness** and **Max Brightness**, and set both values strictly to **1.0** (or switch *Method* to *Manual*). This turns off automatic exposure adjustments that continuously darken or blow out your viewport screen.
   * **Motion Blur:** Expand *Lens > Motion Blur* and set **Amount** to **0.0** to eliminate camera motion smearing during level design.
   * **Bloom:** Expand *Lens > Bloom* and lower **Intensity** to **0.1** or **0.2** to prevent emissive materials from bleeding out your details.

### 2. Baseline Atmosphere Stack
If starting in a completely black, empty scene, add these four components via the **Place Actors** panel to form a dynamic sky dome:
1. **Directional Light:** Set as your primary sun source. In its details, ensure **Atmosphere Sun Light** is checked.
2. **Sky Atmosphere:** Dynamically calculates sky color variants relative to your Directional Light's rotation angle.
3. **Sky Light:** Captures the sky dome colors to fill out shadows so they do not render pitch black.
4. **Exponential Height Fog:** Establishes atmospheric depth and enables volumetric light scattering.
* *Control Shortcut:* Hold `Ctrl + L` and move your mouse inside the viewport to interactively rotate the sun and review lighting changes from noon to dusk.

---

## Phase 6: Essential Editor Quality-of-Life Configurations

Open **Edit > Editor Preferences** to modify default behaviors for an optimized daily workflow:

* **Asset Editor Open Location:** Change from *Default* to **Main Window**. This forces Blueprints, Materials, and assets to open as clean tabs next to your Viewport rather than cluttering your workspace as floating windows.
* **Save on Compile:** Change to **On Success Only**. This automatically saves your progress whenever a Blueprint compiles successfully, mitigating work loss from unexpected editor crashes.
* **Auto-Save Interval:** Located under *Loading & Saving*. Increase from the 10-minute default to **20 or 30 minutes** if working with large maps to stop the asset auto-save step from freezing your editor during heavy blocking tasks.
* **Real-time Thumbnails:** Toggle **Off** via the Content Browser's settings panel on larger projects. Disabling live 3D thumbnail spinning calculations for thousands of assets reclaims massive editor processing performance.