Google Earth Engine Project - NDVI Analysis
This repository contains scripts for analyzing Normalized Difference Vegetation Index (NDVI) data using Google Earth Engine. The analysis focuses on a specific region in Switzerland.
This study was conducted to compare the Normalized Difference Vegetation Index (NDVI) data gathered from satellite and drone sources over identical plots of land on the same day, with the intention of understanding the margin of error between these two methods.

#Description
The main script, ndvi_satellite.js, utilizes the Google Earth Engine API to perform several tasks:

Defines the region of interest using specific polygon coordinates.
Loads image data from the Sentinel-2 satellite and filters it based on date and cloudiness.
Computes the NDVI for each image in the collection.
Applies a standard deviation neighborhood reducer to compute the texture of the NDVI.
Exports the processed NDVI image to Google Drive as a TIFF file.
#Usage
You need to have access to Google Earth Engine (GEE). To execute the script, you can copy the code to the GEE code editor and run it.

#Contributing
Contributions are welcome. Please open an issue to discuss potential improvements or submit a pull request.

#License
Nurhan007 © 2023. All rights reserved.
