import React, {
    forwardRef
} from "react";
import {
    WebView
} from "react-native-webview";

const ConnectDotsWebView = forwardRef((props, ref) => {
    const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
      <title>Continuous Connect the Dots</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      <style>
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
        canvas {
            position: absolute;
            bottom: 10%;
            left: 15%;
             
            border: 1px solid #000;
            touch-action: none;
            border-radius: 20px;
            box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.3);
        }
      </style>
  </head>
  <body>
      <canvas id="connect-dots-pad"></canvas>
      <script>
      var canvas = document.getElementById('connect-dots-pad');
      var ctx = canvas.getContext('2d');
      var isDragging = false;
      var lastX, lastY;

      function adjustCanvasSize() {
          canvas.style.width = '75%';
          canvas.style.height = '45%';
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
      }

      adjustCanvasSize();
      window.addEventListener('resize', adjustCanvasSize);



      // Constants
var minDistanceBetweenDots = 50; // Minimum distance between dots, adjust as needed
var maxAttempts = 100; // Maximum attempts to find a spot for a new dot
var numberOfDotsToGenerate = 200; // Total number of dots you want to generate

function generateDot() {
    // Ensure dots are at least 10px away from the canvas edge
    return {
        x: 10 + Math.random() * (canvas.width - 20), // 10px margin from left and right
        y: 10 + Math.random() * (canvas.height - 20) // 10px margin from top and bottom
    };
}

function isFarEnough(dot, otherDots) {
    return otherDots.every(otherDot => {
        var distance = Math.sqrt((dot.x - otherDot.x) ** 2 + (dot.y - otherDot.y) ** 2);
        return distance >= minDistanceBetweenDots;
    });
}

function generateDots() {
    var dots = [];
    for (var i = 0; i < numberOfDotsToGenerate; i++) {
        var attempts = 0;
        var dot;
        do {
            dot = generateDot();
            attempts++;
            if (attempts > maxAttempts) {
                console.log("Failed to place all dots without crowding");
                return dots; // Return what we have so far to avoid infinite loop
            }
        } while (!isFarEnough(dot, dots));
        dots.push(dot);
    }
    return dots;
}

// Usage
initialDots = generateDots().map(dot => ({
    x: dot.x / 100 * canvas.width,
    y: dot.y / 100 * canvas.height
}));





      var initialDots = generateDots();
      var dotRadius = 7;
      var connections = [];
      var visibleDotsCount = 2;

      var maxSegments = 100; // Maximum number of line segments to keep

      function drawDotsAndConnections() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas

        // Draw dots (unchanged)
        initialDots.forEach((dot, index) => {
            ctx.fillStyle = (index === visibleDotsCount - 1 || index === visibleDotsCount) ? 'black' : 'rgba(0, 0, 0, 0)';
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
            ctx.fill();
        });

        // Set up for a glowing effect for the lines
        ctx.shadowBlur = 20; // Adjust for stronger/weaker glow
        ctx.shadowColor = "#d1684e"; // Glow color changed to #d1684e
    ctx.strokeStyle = "#d1684e";
        ctx.lineWidth = 5; // Line width, adjust as needed

        // Draw connections with the new style
        connections.forEach(connection => {
            ctx.beginPath();
            var points = connection.slice(-maxSegments); // Gets the last segments to draw
            ctx.moveTo(points[0].x, points[0].y); // Move to the starting point of the line
            points.forEach(point => {
                ctx.lineTo(point.x, point.y); // Connect each point with a line
            });
            ctx.stroke(); // Draw the line with the current style (glowing effect)
        });

        // Reset canvas context properties to default if necessary
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
    }



      function getDotIndexAtPosition(x, y) {
          return initialDots.findIndex(dot =>
              Math.sqrt((dot.x - x) ** 2 + (dot.y - y) ** 2) < dotRadius * 2);
      }



      function sendCanvasBase64() {
        var originalWidth = canvas.width;
        var originalHeight = canvas.height;

        // Temporarily resize the canvas for the screenshot
        canvas.width = 800;
        canvas.height = 600;
        drawDotsAndConnections(); // Redraw on resized canvas to ensure updated content is captured

        // Capture and send the base64 image
        var base64Canvas = canvas.toDataURL('image/png');
        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'canvasBase64', data: base64Canvas}));

        // Revert canvas size and redraw with the original content
        canvas.width = originalWidth;
        canvas.height = originalHeight;
        drawDotsAndConnections(); // Ensure to redraw the original content after resizing back
    }

    canvas.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        var touch = e.touches[0];
        var rect = canvas.getBoundingClientRect();
        var x = touch.clientX - rect.left;
        var y = touch.clientY - rect.top;

        if (lastX !== null && lastY !== null) {
            connections[connections.length - 1].push({x: x, y: y});
            drawDotsAndConnections();

            // Check if reached the current visible dot, not the next
            if (visibleDotsCount <= initialDots.length) {
                var currentDot = initialDots[visibleDotsCount - 1]; // Adjust to target the current visible dot
                var distance = Math.sqrt((currentDot.x - x) ** 2 + (currentDot.y - y) ** 2);
                if (distance < dotRadius * 2) { // If close to the current dot
                    // Now we just increase visibleDotsCount without changing the total dot count
                    visibleDotsCount++; // Reveal the next dot without adding a new one yet
                    drawDotsAndConnections();

                    // Only generate a new dot if we're on the last dot and there's room for more
                    if (visibleDotsCount >= initialDots.length && initialDots.length < numberOfDotsToGenerate) {
                        var newDots = generateDots(1); // Generate one new dot
                        if (newDots.length > 0) {
                            initialDots.push(newDots[0]); // Add this new dot to the existing ones
                            // Note: We don't increment visibleDotsCount here, so the new dot won't be visible yet
                            drawDotsAndConnections();
                        }
                    }
                }
            }

            lastX = x;
            lastY = y;
            // Add new point to the current path
            if (connections.length > 0) {
                connections[connections.length - 1].push({x: x, y: y});
                // Ensure we only keep the last 'maxSegments' points
                if (connections[connections.length - 1].length > maxSegments) {
                    connections[connections.length - 1] = connections[connections.length - 1].slice(-maxSegments);
                }
            }
            drawDotsAndConnections();
            sendCanvasBase64();
        }
    });



      canvas.addEventListener('touchstart', function(e) {
          e.preventDefault();
          var touch = e.touches[0];
          var rect = canvas.getBoundingClientRect();
          var x = touch.clientX - rect.left;
          var y = touch.clientY - rect.top;
          var dotIndex = getDotIndexAtPosition(x, y);
          if (dotIndex !== -1) {
              isDragging = true;
              lastX = x;
              lastY = y;
              connections.push([{x: x, y: y}]); // Start a new connection path
          }


          currentLine = [{x: x, y: y}];
    drawCurrentLine(); // Draw the new starting point
      });
      var lastSendTime = Date.now();

      canvas.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        var touch = e.touches[0];
        var rect = canvas.getBoundingClientRect();
        var x = touch.clientX - rect.left;
        var y = touch.clientY - rect.top;

        if (lastX !== null && lastY !== null) {
            connections[connections.length - 1].push({x: x, y: y});
            drawDotsAndConnections();

            // Check if reached the next dot
            if (visibleDotsCount < initialDots.length) {
                var currentDot = initialDots[visibleDotsCount - 1];
                var distance = Math.sqrt((currentDot.x - x) ** 2 + (currentDot.y - y) ** 2);
                if (distance < dotRadius * 10) { // If close to the current dot
                    visibleDotsCount++; // Move forward in the sequence
                    drawDotsAndConnections();
                }
            }

            lastX = x;
            lastY = y;
            // Add new point to the current path
            if (connections.length > 0) {
                connections[connections.length - 1].push({x: x, y: y});
                // Ensure we only keep the last 'maxSegments' points
                if (connections[connections.length - 1].length > maxSegments) {
                    connections[connections.length - 1] = connections[connections.length - 1].slice(-maxSegments);
                }
            }
            drawDotsAndConnections();
        }
    });


    canvas.addEventListener('touchend', function(e) {
        isDragging = false;
        lastX = null;
        lastY = null;
        connections = [];

        // No need to check for new dot reveal on touchend as it is handled in touchmove

        var originalWidth = canvas.width;
    var originalHeight = canvas.height;
    canvas.width = 800;
    canvas.height = 600;
    drawDotsAndConnections(); // Redraw the canvas content on the resized canvas

    // Take the base64 encoding of the canvas
    //var base64Canvas = canvas.toDataURL('image/png');
    //window.ReactNativeWebView.postMessage(JSON.stringify({type: 'canvasBase64', data: base64Canvas}));

    // Revert the canvas back to its original size
    canvas.width = originalWidth;
    canvas.height = originalHeight;
    drawDotsAndConnections(); // Redraw the canvas content on the original sized canvas
    sendCanvasBase64();
    currentLine = []; // Clear the current line
    drawCurrentLine();
    });



      drawDotsAndConnections();
      </script>
  </body>
  </html>
  `;

    return ( <
        WebView originWhitelist = {
            ["*"]
        }
        source = {
            {
                html: htmlContent
            }
        }
        onMessage = {
            props.onMessage
        }
        ref = {
            ref
        }
        style = {
            {
                flex: 1
            }
        }
        />
    );
});

export default ConnectDotsWebView;
 