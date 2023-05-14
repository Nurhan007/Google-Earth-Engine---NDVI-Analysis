

// Define countries boundary
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');
var Switzerland = countries.filter(ee.Filter.eq('country_na', 'Switzerland'));

// Define the region of interest (ROI) using the polygon coordinates
var polygon = ee.Geometry.Polygon([
  [[6.59097141027015,46.58808512541618],
   [6.594436824317391,46.587148712016855],
   [6.596866905684884,46.58930538789279],
   [6.59446364640754,46.58985468137046],
   [6.592881054460968,46.590215376218865],
   [6.592248053133454,46.590276203272936],
   [6.591990561068024,46.58945779718956],
   [6.591466673330073,46.588744198533014],
   [6.59097141027015,46.58808512541618]]
]);

var addNDVIBands = function(image) {
  var NDVI = image.addBands(image.normalizedDifference(['B8', 'B4']));
  var NDWI = NDVI.addBands(NDVI.normalizedDifference(['B3', 'B8']));
  return NDWI.addBands(NDWI.metadata('system:time_start'));
};

// Load imageries
var img = ee.ImageCollection('COPERNICUS/S2_SR')
.filterDate('2019-09-10', '2019-10-31')
.filterBounds(polygon) // Filter the image collection based on the ROI
.filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 10))
.map(addNDVIBands);
var img_ndvi = ee.ImageCollection(img).select("nd");
var ndvi = img_ndvi.mean();
print(ndvi);

// Compute standard deviation (SD) as texture of the NDVI.
var SD_Kernel = ndvi.reduceNeighborhood({
  reducer: ee.Reducer.stdDev(),
  kernel: ee.Kernel.circle(3),
});

// Set the CRS of the image to Web Mercator.
var SD_Kernel_WGS84 = SD_Kernel.reproject({
  crs: 'EPSG:3857', // Web Mercator
  scale: 30
});

// Export the image to Google Drive as a TIFF file.
var exportParams = {
  image: SD_Kernel_WGS84,
  description: 'SD_Kernel_NDVI',
  scale: 30,
  region: polygon // Export the image only for the ROI
};

Export.image.toDrive(exportParams);

// Display the results.
var vizParams = {'bands': 'B4, B3, B2', 'min': 0, 'max': 3000};
Map.addLayer(img.min().clip(polygon), vizParams, "Sentinel 2 Switzerland");
Map.addLayer(ndvi.clip(polygon), {min: -1, max: 1, palette: ['00FF00', '000000']}, 'NDVI');
Map.addLayer(SD_Kernel_WGS84.clip(polygon), {min: 0, max: 0.3}, 'SD Kernel NDVI');
Map.centerObject(polygon, 12);
