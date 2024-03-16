# Sync DOM + WebGL (r3f)

1. Initialize smooth scroll (w/ scrollable container)
2. Create WebGL canvas with 1:1 pixel mapping to DOM elements
2. Pass reference to all dom elements to be replaced by WebGL meshes
3. Sync position of each mesh using getBoundingClientRect
