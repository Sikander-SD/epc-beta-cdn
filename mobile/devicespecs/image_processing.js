// Wait for the image to load
function imageProcessing(img) {
  // Create a canvas element
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  // Set the canvas dimensions to match the image
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw the image on the canvas
  ctx.drawImage(img, 0, 0);

  // Get the image data
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;

  // Apply the Sobel operator for edge detection
  var sobelData = sobel(data, canvas.width, canvas.height);

  // Create a new canvas to display the edges
  var edgesCanvas = document.createElement('canvas');
  var edgesCtx = edgesCanvas.getContext('2d');

  // Set the canvas dimensions
  edgesCanvas.width = canvas.width;
  edgesCanvas.height = canvas.height;

  // Put the sobel data onto the new canvas
  var newImageData = edgesCtx.createImageData(edgesCanvas.width, edgesCanvas.height);
  newImageData.data.set(sobelData);
  edgesCtx.putImageData(newImageData, 0, 0);

  // Set color to red for detected edges
  var redEdgesData = setRedEdges(sobelData);

  // Put the modified data onto the new canvas
  var redEdgesImageData = edgesCtx.createImageData(edgesCanvas.width, edgesCanvas.height);
  redEdgesImageData.data.set(redEdgesData);
  edgesCtx.putImageData(redEdgesImageData, 0, 0);

  // Append the new canvas to the document body
  document.body.appendChild(edgesCanvas);
};

// Sobel operator for edge detection
function sobel(data, width, height) {
  var outputData = new Uint8ClampedArray(data.length);
  var kernelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  var kernelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  var weight = 0.15;

  for (var y = 1; y < height - 1; y++) {
    for (var x = 1; x < width - 1; x++) {
      var sumX = 0;
      var sumY = 0;

      for (var ky = 0; ky < 3; ky++) {
        for (var kx = 0; kx < 3; kx++) {
          var cx = x + kx - 1;
          var cy = y + ky - 1;
          var offset = (cy * width + cx) * 4;
          var gx = kernelX[ky * 3 + kx];
          var gy = kernelY[ky * 3 + kx];
          sumX += data[offset] * gx;
          sumY += data[offset] * gy;
        }
      }

      var offset = (y * width + x) * 4;
      var magnitude = Math.sqrt(sumX * sumX + sumY * sumY) / weight;
      outputData[offset] = magnitude;
      outputData[offset + 1] = magnitude;
      outputData[offset + 2] = magnitude;
      outputData[offset + 3] = 255; // Alpha channel
    }
  }


  return outputData;
}

// Set color to red for detected edges
function setRedEdges(data) {
  var outputData = new Uint8ClampedArray(data.length);
  var threshold = 100; // Adjust this value to control edge detection sensitivity

  for (var i = 0; i < data.length; i += 4) {
    var magnitude = data[i]; // Assuming the edges are in the red channel

    if (magnitude > threshold) {
      outputData[i] = 255; // Red
      outputData[i + 1] = 0; // Green
      outputData[i + 2] = 0; // Blue
      outputData[i + 3] = 255; // Alpha channel
    } else {
      outputData[i] = 0; // Red
      outputData[i + 1] = 0; // Green
      outputData[i + 2] = 0; // Blue
      outputData[i + 3] = 0; // Alpha channel (transparent)
    }
  }

  return outputData;
}
