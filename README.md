## Listing Data
While the CREA and StatsCan data will provide us historical information on prices, affordability and salary, the real-time listing data will provide us with the actual listing information and the current prices. This data is scraped from realtor.ca and has all the live listings.
- Sourcing: This data is scraped programmatically from the webiste using beautiful soup, splinter and webdriver and is written in a dataframe which will be migrated to the database
- Adding elements: The address data will be searched in Google for each listing to extract the latitudes and longitudes for mapping in the front-end
- Front-end: Using lat/long, mapbox API, this data will be used for visualisation
- ML: The idea here is to create a prediction of prices for the same homes 5 years from now. 
