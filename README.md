# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Responsive Design
I designed the UI to adapt seamlessly across devices:

Mobile (<768px)
I used a bottom tab navigation, collapsible filters, and horizontal scrolling for Kanban.
Tablet (768px+)
Added inline view toggles and compact filter chips.
Desktop (1280px+)
Full layout with all columns visible for maximum productivity.

# Zustand
I chose Zustand instead of Context + useReducer because:

It removes boilerplate (no providers, reducers, or dispatch)
Components only re-render when their specific state changes
State and actions live together, making the store easy to manage
It performs efficiently even with large datasets (500+ tasks)

# Virtual Scrolling
To handle large datasets efficiently, I implemented my own virtual scrolling:

Created a scrollable container with fixed height
Used a spacer div to simulate full height
Calculated visible rows based on scroll position
Rendered only ~15–20 items at a time
Added buffer rows to avoid flickering

# Drag-and-Drop

To handle large datasets efficiently, I implemented my own virtual scrolling:

Created a scrollable container with fixed height
Used a spacer div to simulate full height
Calculated visible rows based on scroll position
Rendered only ~15–20 items at a time
Added buffer rows to avoid flickering

# I built a custom drag-and-drop system using the HTML5 Drag API:

Drag Start: I attach task ID and show a ghost preview
Drag Over: Columns highlight when hovered
Drop: Task is moved between columns using Zustand
Snap-back: Invalid drops revert automatically
Touch Support: Works with native browser touch behavior

# implemented
Kanban Board with 4 columns and custom drag-and-drop
List View with virtual scrolling and sorting
Timeline/Gantt view with date visualization
Real-time filters (status, priority, assignee, date)
URL-synced filters for navigation persistence
“Clear All” filter functionality
Simulated collaboration indicators
Due date labels and overdue tracking
Empty states for better UX
500-task dataset generator
Fully responsive design
TypeScript across the entire project

# tech-stack
Frontend: React 18 + TypeScript
State Management: Zustand
Styling: CSS + custom properties
Drag & Drop: Native HTML5 API
Virtual Scroll: Custom implementation
Routing State: window.history.replaceState
Data: In-memory generated dataset

# Performance Optimization

To keep the app fast and efficient:

I limited DOM nodes using virtual scrolling
Used Zustand to avoid unnecessary re-renders
Avoided heavy UI libraries
Used CSS transitions instead of JS animations

# What I’d Improve Next

If I had more time, I would:

Replace HTML5 drag with Pointer Events for smoother UX
Add zoom levels in the timeline
Persist data using localStorage or backend storage