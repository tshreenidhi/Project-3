--Create Table Seniments 	
CREATE TABLE sentiments (
	id INTEGER PRIMARY KEY,
	text VARCHAR (160) NOT NULL,
	sentiment VARCHAR (25) NOT NULL,
	user_name VARCHAR (40) NOT NULL,
	platform VARCHAR (12) NOT NULL,
	hashtags VARCHAR (50) NOT NULL,
	retweets DECIMAL,
	likes DECIMAL,
	country VARCHAR (25) NOT NULL,
	year INTEGER);
	
--Create Table Seniments xref
CREATE TABLE sentiments_xref (
	sentiment VARCHAR (25) NOT NULL PRIMARY KEY,
	value VARCHAR (8) NOT NULL);
	
--Create Table for Union of Happiness years
CREATE TABLE happiness_years (
	id serial PRIMARY KEY,
	year_id INTEGER, 
	Year INTEGER,
	country VARCHAR (30) NOT NULL,
	ladder_score DECIMAL,
	gdp_per_capita DECIMAL,
	generosity DECIMAL,
	social_support DECIMAL,
	corruption DECIMAL);
	
--Create table for Happiness Index
CREATE TABLE happiness_index (
	id serial PRIMARY KEY,
	country VARCHAR (30) NOT NULL,
	year INTEGER NOT NULL,
	index DECIMAL,
	rank DECIMAL)
	
--Constraints
ALTER TABLE sentiments ADD CONSTRAINT fk_sentiments_sentiment FOREIGN KEY(sentiment)
REFERENCES sentiments_xref (sentiment);

--import files to table order:
-- 1. Load "sentiments_xref" table with the "sentiments_xref" file
-- 2. Load "Sentiments" table with the "sentiments" file.
-- 3. Load "happiness_years" table with the "UnionHappinessFile" file. 
	-- a. Remove the id searal primary key from import
-- 4. Load "Happiness_index" table with the "WorldHappinessIndex2013-2023" file. 
	-- a. Remove the id searal primary key from import