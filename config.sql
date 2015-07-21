CREATE DATABASE IF NOT EXISTS tBp;
USE tBp;

DROP TABLE IF EXISTS tbp_user;
DROP TABLE IF EXISTS tbp_event;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS event;

CREATE TABLE user (
primary_key 	INT 				NOT NULL AUTO_INCREMENT,
user_id		INT 				NOT NULL DEFAULT -1, 
last_name   	VARCHAR(255) 		NOT NULL DEFAULT '', 
first_name  	VARCHAR(255) 		NOT NULL DEFAULT '', 
barcode_hash 	VARCHAR(255)    	NOT NULL DEFAULT '',
PRIMARY KEY (primary_key)

) ENGINE=INNODB; 

CREATE TABLE event (
primary_key		INT 				NOT NULL AUTO_INCREMENT, 
event_id 		INT 				NOT NULL DEFAULT -1, 
name 			VARCHAR(255) 		NOT NULL DEFAULT '',
datetime 		DATETIME 			NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (primary_key)

) ENGINE=INNODB; 

CREATE TABLE tbp_user (
parent_key 		INT 				NOT NULL, 
house_color		ENUM('red', 'green', 'blue')	NOT NULL, 
member_status	ENUM('active', 'inactive', 'initiate', 'officer') NOT NULL, 

PRIMARY KEY (parent_key),
FOREIGN KEY (parent_key) REFERENCES user(primary_key)
ON DELETE CASCADE

) ENGINE=INNODB; 

CREATE TABLE tbp_event (
parent_key 		INT 				NOT NULL, 
default_points	INT 				NOT NULL DEFAULT 0, 
officer			VARCHAR(255)		NOT NULL DEFAULT 'atonyguy',
event_type 		ENUM('academic', 'social', 'community', 'wildcard')	NOT NULL,

PRIMARY KEY (parent_key),
FOREIGN KEY (parent_key) REFERENCES event(primary_key)
ON DELETE CASCADE

) ENGINE=INNODB; 
