CREATE TABLE clustered_listings (
	listing_ID INT,
	Price FLOAT,
	Beds INT,
	Baths INT,
	Address VARCHAR (40),
	Postal_Code VARCHAR (40),
	City VARCHAR (40),
	Latitude FLOAT,
	Longitude FLOAT,
	Cluster INT,
	PRIMARY KEY (listing_ID)
	);

CREATE TABLE historical_info (

	history_ID INT,
	City VARCHAR (40),
	Year INT,
	Month VARCHAR (40),
	Sold INT,
	List_price_avg FLOAT,
	Sold_price_avg FLOAT,
	above_below_percentage FLOAT,
	monthly_change FLOAT,
	monthly_change_percentage FLOAT,
	days_on_mar INT,

	PRIMARY KEY (history_ID)
	
	);


	SELECT * FROM historical_info

CREATE TABLE salaries_ontario (
	
	salary_ID INT,
	NOC_CNP VARCHAR (40),
	NOC_Title VARCHAR (40),
	Titre_CNP VARCHAR (40),                                  
	PROV VARCHAR (40),
	ER_Code_Code_RE VARCHAR (40),
	ER_Name_Nom_RE VARCHAR (40),
	Low_Wage_Salaire_Minium FLOAT,
	Median_Wage_Salaire_Median FLOAT,
	High_Wage_Salaire_Maximal FLOAT,
	Data_Source_E VARCHAR (40),
	Data_Source_F VARCHAR (40),
	Reference_Period INT,
	Revision_Date_Date_revision DATE,
	Wage_Comment_E VARCHAR (40),
	Wage_Comment_F VARCHAR (40),

	PRIMARY KEY (salary_ID)
	
	);

SELECT * FROM historical_info