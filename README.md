# capstone

## Project Overview
Here is the link to the Google slides presentation which includes our overall project plan and updates on where we are as we work through the project.
https://docs.google.com/presentation/d/16HX-4gxxWvJhYth8kHkRRqW-fMynWEsueiPTrCZG0BY/edit?usp=sharing



## Backend Data Collection & Cleaning

### Pivoting to find the right data to fit our needs:
After exploratory analysis to find the data from CREA (Canadian Real Estate Association) and the realtor.ca website, we hit snags which prevented us from programmatically scraping and using this data to perform machine learning analysis. The key issues faced were as follows
- Lack of meaningful features which help in building a predictive/classification model
- Anti-scraping measures undertaken by the realtor.ca website  

To avoid these we pivoted to find a more reliable data source with multiple features. We leveraged data from listing.ca and programmatically scraped two datasets
1. Listing Data
2. Historical prices  
The main caveat here is we had to geographically restrict ourself to Ontario and Greater Toronto Area to get better and more feature rich data.

Key parts of the code which helped us in the scraping 

``` python
listing_info=[]

for i in range(1,200):
    url = f"https://listing.ca/mls/?..........{i}..$"
    print(f"Scraping {url}")
    resp = main_session.get(url)
    time.sleep(3)
    listing_ca_page = soup(resp.content, 'html.parser')
    #extracting information
    prop_address = listing_ca_page.find_all("div",{"class","slt_address"})
    prop_beds = listing_ca_page.find_all("div",{"class","slt_beds"})
    prop_baths = listing_ca_page.find_all("div",{"class","slt_baths"})
    prop_price = listing_ca_page.find_all("div",{"class","slt_price"})
    prop_desc = listing_ca_page.find_all("div",{"class","sl_loc"})
    prop_text = listing_ca_page.find_all("div",{"class","sl"})
    j=0
    for j in range(0,len(prop_address)):
        add = prop_address[j].text
        price = prop_price[j].text
        beds = prop_beds[j].text
        baths = prop_baths[j].text
        location = prop_desc[j].text
        text = prop_text[j].text
    
        listing_info.append({
            "Address": add,
            "Price": price,
            "Beds": beds,
            "Baths": baths,
            "Location": location,
            "All_Text": text
        })

df_listing = pd.DataFrame(listing_info)
df_listing.head()
```





### Housing Prices:
We sourced Canadian housing price data which has prices for 6 different types of houses.  The data is by month by different geographies across Canada, allowing us to look at prices over time.  The data starts in January 2005 and goes until November 2021.

The information that is in the file is raw housing prices in $ (chose non-seasonally adjusted data) as well as an HPI index with 100 for each of the pricing in January 2005.  

We have put a hold on further analysis of this data, and have focused on the Listing data from realtor.ca discussed below.  We are looking at also scraping some more data from realtor.ca which will have time series information we are looking to use in our dashboard to provide some additional insights for our users.

Source is a Stats Canada website:
https://www.crea.ca/hpi-tools-terms-of-use/

### Salaries:
We sourced Canadian salaries by various different types of job by geography.  The data is based on 2021 levels, but prior years are available for download.

Depending on the job category, some had annual salary and some had hourly rate.  We have translated all $ to annual salary to be able to compare across job types by assuming 2,080 hours per year. 

See a sample of the table of this data that we have cleaned/process in Python and uploaded to PostgresSQL... this view can be found in the Database section. While we do have data across the country, we filtered out all the other provices and just left Ontario data as the listing data we have is all within Ontario primarily in and aroung the Greater Toronto Area (GTA).

Source is a Stats Canada website (2021 data):
https://open.canada.ca/data/en/dataset/adad580f-76b0-4502-bd05-20c125de9116

## Listing Data
While the CREA and StatsCan data will provide us historical information on prices, affordability and salary, the real-time listing data will provide us with the actual listing information and the current prices. This data is scraped from realtor.ca and has all the live listings.
- Sourcing: This data is scraped programmatically from the webiste using beautiful soup, splinter and webdriver and is written in a dataframe which will be migrated to the database
- Adding elements: The address data will be searched in Google for each listing to extract the latitudes and longitudes for mapping in the front-end
- Front-end: Using lat/long, mapbox API, this data will be used for visualisation
- ML: The idea here is to create a prediction of prices for the same homes 5 years from now. 
- Cleaning/Processing: See a sample of the table of this data in Database section that we have cleaned/processed in Python and uploaded to PostgresSQL.

=======
# Database Sketch

The database for this project will consist of four tables. Their relationships, variables, variables types and primary keys can be found in the diagram below:

![](/Images/QuickDBD-Capstone_Sketch.png)

We have pushed a few different data sets we downloaded or webcraped into PostgresSQL after cleaning/processing data in Python. Here is an image of all the tables we have pushed to Postgres: <br />
![tables in postgres for capstone](https://github.com/gram89/capstone/blob/backend-data-collection-cleaning-segment2/Images/tables_list.png)

At this point there are two of the tables that we are planning to use in the Machine Learning model and in our frontend dashboard which we are planning to do as a webpage using JavaScript/HTML/Bootstrap/CSS.  Please have a look at Table 1 and Table 4 below, we have pulled out a sample of that data we have in the SQL database at this time. 

The data found on each table is explained in the dictionary below:

## Table 1: Salaries Information
 
This data refers to a salary research per region.

| Variable | Data Type | Description |
|----------|-----------|-------------|
| salary | double | Salary average in a region. |
| sector_industry | varchar | What sector or industry the salary belongs to. |
| province | varchar | Which province this information was collected from.|


![salaries table view](https://github.com/gram89/capstone/blob/backend-data-collection-cleaning-segment2/Images/salaries.png)

## Table 2: Geography Data

This data refers to geographical data of any datapoint found in the research.

| Variable | Data Type | Description |
|----------|-----------|-------------|
| address | varchar | Full address of any datapoint found.|
| longitude | double | Longitude of the address.| 
| latitude | double | Longitude of the address.|
| street_address | varchar | The street address component of the full address.| 
| city | varchar | The city extracted from the full address.| 
| province | varchar | The province extracted from the full address.| 
| postalcode | varchar | The postalcode extracted from the full address.| 


## Table 3: Properties

This data refers to the features we intend to use to predict the prices in the housing market in Canada in the next five years.

| Variable | Data Type | Description | 
|----------|-----------|-------------|
| price | double | The price of the property. | 
| timestamp | date | the time stamp when the data was captured.| 
| square_footage | varchar | The square footage for main living & basement areas.|
| rooms | int | Number of rooms above the basement level. |  
| bathroom | double | Number of bathrooms & half-bathrooms. | 
| property_type | varchar | The type of the property, to be defined according to the database found.| 
| lot_size | double | The size of the lot.|
| property_age | int | How many years passed since the property was built.|
| parking | varchar | Whether the house has parking.| 
| heating_type | varchar | How the home is heated.| 
| FFSR | varchar | Foundation, flooring, siding & roofing types. | 
| property_view | varchar | Whether the property has waterfront or panoramic view. | Whether the property has been sold previously (newly constructed and previously unsold, or repeat sale). |
| selling_status | varchar | Whether the property has been sold previously (newly constructed and previously unsold, or repeat sale). | 
| proximity | varchar | Proximity to shopping, schools, hospitals, police stations, churches, sports centres, golf courses, parks, and transportation (including the train station, railways, and airports).
| fireplace_basement | varchar | Whether it has a fireplace and/or finished basement. | 
| address | varchar | The full address of the property. | 


## Table 4: Listings

The data below will be extracted from Realtor.ca so we can apply the predictions in the current listings to forecast how much these same listings will have their prices increased in the next five years.

Variable | Data Type | Description
|----------|-----------|-------------|
| timestamp | date | The date when the listing was visualized. | 
| price | double | The listing price of the property.| 
| address | varchar | The full address of the property.| 
| bedrooms | double | How many bedrooms the property has.| 
| bathrooms | double | How many bathrooms the property has.|


![listing table view](https://github.com/gram89/capstone/blob/backend-data-collection-cleaning-segment2/Images/listings.png)



## ML Initial Ideas

The objective of this project is to predict the prices of houses five years from now and if the houses are affordable based on the salary of an individual. This prediction of prices and a property’s affordability is made possible by using machine learning. The variables available in the data related to the real estate are, for example, the price of the property, number of rooms, bathrooms in a property, lot sizes, etc., will be used to predict the prices in the housing market in Canada in the next five years. This will be done using supervised and unsupervised machine learning enabling us to estimate the prices. 

The nature of the analysis and the desired outcome will allow us to mostly focus on logistic regression using the number of rooms in the property, the square food, address, number of bedrooms and bathroom and the current price. 

The unsupervised machine learning will be utilized for predicting and displaying which individuals falling under a range of salary will be able to afford a property in a specific range. For example, if an individual’s salary falls under the range of $80,000.00 to $100,000.00, will this individual be able to afford a property amounting to $750,000.00. The information like the individual’s salary, individual’s employment sector and the province will also be factored in. 

