/*
1) Download MySQL and install (it may ask you to set a root password)
2) Run mysql.server start
3) mysql -u root -p PASSWORD_HERE
4) Inside the mysql REPL, run source config.sql
    This should create the Database named tBp, with the tables 
    defined below. This command is a destructive create, it will 
    reset everything about the tBp database.
*/ 
DROP DATABASE IF EXISTS tBp;
CREATE DATABASE tBp;
USE tBp;

CREATE TABLE user (
id              INT                 NOT NULL AUTO_INCREMENT,
valid           BOOLEAN             NOT NULL DEFAULT True,
lastName        VARCHAR(255)        NOT NULL DEFAULT '',
firstName       VARCHAR(255)        NOT NULL DEFAULT '',
barcodeHash     VARCHAR(255)        NOT NULL DEFAULT '',

INDEX(id),
INDEX(barcodeHash),
PRIMARY KEY (id)

) ENGINE=INNODB; 

CREATE TABLE event (
id              INT                 NOT NULL AUTO_INCREMENT,
valid           BOOLEAN             NOT NULL DEFAULT True,
name            VARCHAR(255)        NOT NULL DEFAULT '',
datetime        DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,

INDEX(id),
PRIMARY KEY (id)

) ENGINE=INNODB; 

CREATE TABLE tbp_user (
parentId        INT                             NOT NULL,
house           ENUM('red', 'green', 'blue')    NOT NULL,
memberStatus    ENUM('initiate', 'member', 'officer') NOT NULL,

PRIMARY KEY (parentId),
FOREIGN KEY (parentId) REFERENCES user(id) ON DELETE CASCADE

) ENGINE=INNODB; 

CREATE TABLE tbp_event (
parentId        INT                 NOT NULL,
points          INT                 NOT NULL DEFAULT 0,
officer         VARCHAR(255)        NOT NULL DEFAULT 'atonyguy',
type            ENUM('academic', 'social', 'community') NOT NULL,
wildcard        BOOLEAN             NOT NULL DEFAULT False,

PRIMARY KEY (parentId),
FOREIGN KEY (parentId) REFERENCES event(id) ON DELETE CASCADE

) ENGINE=INNODB;

CREATE TABLE user_event (
userId      INT             NOT NULL,
eventId     INT             NOT NULL,
valid       BOOLEAN         NOT NULL DEFAULT True,
pointsEarned INT            NOT NULL,
type        ENUM('academic', 'social', 'community') NOT NULL,

PRIMARY KEY (userId, eventId),
INDEX (userId, eventId),
FOREIGN KEY (userId) REFERENCES user(id),
FOREIGN KEY (eventId) REFERENCES event(id)

) ENGINE=INNODB;
