#!/bin/bash
# docker/cypress/start.sh

# Start Xvfb
Xvfb :99 -screen 0 1024x768x24 &

# Start window manager
fluxbox &

# starts VNC server
x11vnc -display :99 -nopw -listen 0.0.0.0 -xkb -ncache 10 -ncache_cr -forever  &
# starts noVNC server
websockify --web /usr/share/novnc/ 6080 localhost:5900 &

# Set display
export DISPLAY=:99

# Start Cypress
npx cypress open --config-file ./cypress.config.js