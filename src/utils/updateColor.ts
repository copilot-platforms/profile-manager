export function updateColor(rgbaColor: any, newOpacity: number) {
  // Parse the input RGBA color string
  const colorRegex = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/;
  const match = rgbaColor?.match(colorRegex);

  if (!rgbaColor || !match) {
    // Invalid input format, return the original color
    return rgbaColor;
  }

  // Extract color components
  const [, red, green, blue] = match;

  // Build the updated RGBA color string with the new opacity
  const updatedColor = `rgba(${red}, ${green}, ${blue}, ${newOpacity})`;

  return updatedColor;
}
