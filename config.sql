/*
1) Download MySQL and install (it may ask you to set a root password)
2) Run mysql.server start
3) mysql -u root -p PASSWORD_HERE
4) Inside the mysql REPL, run source config.sql
	This should create the Database named tBp, with the tables 
	defined below. This command is a destructive create, it will 
	reset everything about the tBp database.
*/ 
CREATE DATABASE IF NOT EXISTS tBp;
USE tBp;

DROP TABLE IF EXISTS user_event;
DROP TABLE IF EXISTS tbp_user;
DROP TABLE IF EXISTS tbp_event;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS event;

CREATE TABLE user (
primary_key 	INT 				NOT NULL AUTO_INCREMENT,
user_id			INT 				NOT NULL DEFAULT -1, 
valid			BOOLEAN				NOT NULL DEFAULT False,
last_name   	VARCHAR(255) 		NOT NULL DEFAULT '', 
first_name  	VARCHAR(255) 		NOT NULL DEFAULT '', 
barcode_hash 	VARCHAR(255)    	NOT NULL DEFAULT '',

INDEX(user_id),
PRIMARY KEY (primary_key)

) ENGINE=INNODB; 

CREATE TABLE event (
primary_key		INT 				NOT NULL AUTO_INCREMENT, 
event_id 		INT 				NOT NULL DEFAULT -1, 
valid			BOOLEAN				NOT NULL DEFAULT False,
name 			VARCHAR(255) 		NOT NULL DEFAULT '',
datetime 		DATETIME 			NOT NULL DEFAULT CURRENT_TIMESTAMP,

INDEX(event_id),
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

CREATE TABLE user_event (
user_id     INT     				NOT NULL,
event_id    INT     				NOT NULL,
valid		BOOLEAN					NOT NULL DEFAULT False,

PRIMARY KEY (user_id, event_id),
INDEX (user_id, event_id),
FOREIGN KEY (user_id) REFERENCES user(primary_key) ON UPDATE CASCADE,
FOREIGN KEY (event_id) REFERENCES event(primary_key) ON UPDATE CASCADE

) ENGINE=INNODB;




