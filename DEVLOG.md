# CPU Simulator Development Log

---

# Day 1 (7 July 2026)

## Goal
Initialize the project and build the rendering foundation.

## Completed

### Project Setup
- Initialized project using Vite + React + TypeScript
- Designed initial project architecture
- Created application layout
- Added responsive canvas workspace

### Rendering Engine
- Implemented CanvasRenderer
- Added continuous render loop
- Automatic canvas resizing
- Canvas clearing pipeline

### Grid System
- Implemented initial infinite dot grid

## Milestone
✔ Rendering engine successfully initialized.

---

# Day 2 (8 July 2026)

## Goal
Build the editor foundation before implementing components.

## Completed

### Camera System
- Created Camera class
- Implemented camera position
- Implemented zoom system
- Implemented world ↔ screen coordinate conversion
- Added middle mouse panning
- Added cursor-centered zoom

### Math Module
- Created reusable Vector2 class

### Grid Renderer
- Separated GridRenderer from CanvasRenderer
- Grid now follows camera movement
- Grid scales correctly with zoom

### Circuit Architecture
- Added Circuit class
- Added abstract Component class
- Added ComponentRenderer
- Created placeholder AndGate component
- Designed initial simulation architecture

### Project Architecture
Current engine structure:

engine/
├── camera/
├── circuit/
├── components/
├── input/
├── math/
├── renderer/
└── ui/

## Architecture Decisions

- Rendering separated from simulation.
- Components will only store data.
- Renderers will handle drawing.
- Circuit manages all components.
- Camera is responsible for coordinate transformations.

## Current Progress

✔ Responsive Canvas

✔ Infinite Grid

✔ Camera Pan

✔ Camera Zoom

✔ Cursor Centered Zoom

✔ Circuit Architecture

✔ Component Architecture

✔ Rendering Pipeline

## Next (Day 3)

- Build toolbar
- Tool selection system
- Input manager
- Component placement
- Render first real AND gate

Day 3 – Interactive Wiring System
✅ Completed
Implemented interactive wire creation.
Added multi-segment wire routing.
Wire bends can now be placed anywhere on the canvas.
Implemented orthogonal (90°) wire rendering.
Connected wires directly to gate pins.
Added live wire preview while routing.
Fixed multiple routing/rendering bugs.
Improved renderer architecture by separating wire storage from drawing logic.
Refactored wire path handling using vertex-based routing.