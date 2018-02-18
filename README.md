# Installation
* Setup MySQL server, create database, set permissions
* Update *./modules/config.js* (section **storage**) accordingly
* Run `npm install`
* Run `npm run db_install`
* Optional: Update HTTP ports in *./modules/config.js*

#  Launch
Run `npm run start`

# Usage
You can enter commands in console mode: `log` to see logfile data and `state` to see the "stock exchange state".
You can enter URL in console mode and it will be parsed and the request will be processed. Response will appear in the console.
And of course you can enter URL in browser.
In both cases you should use this format: `http://localhost:{port}/?CountryCode={CountryCode}&Category={Category}&BaseBid={BaseBid}`
Also you can access `http://localhost:{port}/mon` This page shows app activity using WebSockets. Don't forget to press **Connect** button on this page if connection is lost. 

# Misc
*./model/demo_stock_exchage.mwb* - database model created with MySQL Workbench.
*./model/export.sql* - the model exported to text file with SQL statements. In use by *./db_install.js*
