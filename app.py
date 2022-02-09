# import dependancies
from config import db_password
from flask import Flask, render_template
from sqlalchemy import create_engine
import pandas as pd
#import psycopg2

# Flask Setup
app = Flask(__name__)

# Database Setup
db_string=f"postgresql://postgres:{db_password}@127.0.0.1:5432/capstone_group6"
engine=create_engine(db_string)
dbConnection=engine.connect
#df = pd.read_sql_query('SELECT * FROM "salaries"', dbConnection)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/getdata")
def data():
    df = pd.read_sql_query('SELECT * FROM "salaries"', dbConnection)
    data_list=[]
    for i in range(len(df)):
        entry = {'NOC_CNP':df['NOC_CNP'].iloc[i],'NOC_Title':df['NOC_Title'].iloc[i],'Titre_CNP':df['Titre_CNP'].iloc[i],\
                 'PROV':df['PROV'].iloc[i],'ER_Code_Code_RE':df['ER_Code_Code_RE'].iloc[i],\
                 'ER_Name_Nom_RE':df['ER_Name_Nom_RE'].iloc[i],'Low_Wage_Salaire_Minium':df['Low_Wage_Salaire_Minium'].iloc[i],\
                 'Median_Wage_Salaire_Median':df['Median_Wage_Salaire_Median'].iloc[i],\
                 'High_Wage_Salaire_Maximal':df['High_Wage_Salaire_Maximal'].iloc[i],'Data_Source_E':df['Data_Source_E'].iloc[i]}
        data_list.append(entry)
    return data_list

if __name__ == "__main__":
    app.run(debug=True)