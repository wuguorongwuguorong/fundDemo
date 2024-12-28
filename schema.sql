SQL schema for ABC fund

create database fundOverview;

USE fundOverview;

--Creating customer table
create table Customers (
    cust_id INT AUTO_INCREAMENT PRIMARY KEY,
    bank_id INT,
    agent_id INT,
    pnote_id INT,
    cFirst_name VARCHAR(255) NOT NULL,
    cLast_name VARCHAR(255) NOT NULL,
    dob DATETIME NOT NULL,
    NRIC VARCHAR(16) NOT NULL,
    gender CHAR NOT NULL
    addr_1 VARCHAR(45) NOT NULL,
    addr_2 VARCHAR(45) NOT NULL,
    zipcode VARCHAR(10) NOT NULL,
    cEmail VARCHAR(100) NOT NULL,
    bank_num INT NOT NULL,
    FOREIGN KEY (bank_id) REFERENCES Banks(bank_id),
    FOREIGN KEY (agent_id) REFERENCES Agents(agent_id),
    FOREIGN KEY (pnote_id) REFERENCES Pnotes(pnote_id)
)

CREATE TABLE Agents(
    agent_id INT AUTO_INCREAMENT PRIMARY KEY,
    pnote_id INT,
    aFirst_name VARCHAR(255) NOT NULL,
    aLast_name VARCHAR(255) NOT NULL,
    aEmail VARCHAR(100) NOT NULL,
    join_date DATETIME NOT NULL,
    FOREIGN KEY (pnote_id) REFERENCES Pnotes(pnote_id)
)

CREATE TABLE Banks(
    bank_id INT AUTO_INCREAMENT PRIMARY KEY,
    bank_name VARCHAR(255) NOT NULL, 
    addr_1 VARCHAR(45) NOT NULL,
    addr_2 VARCHAR(45) NOT NULL,
    zipcode VARCHAR(10) NOT NULL,
    swift_code VARCHAR(16) NOT NULL,
)

CREATE TABLE Pnotes(
    pnote_id INT AUTO_INCREAMENT PRIMARY KEY,
    cust_id INT,
    insert_date DATETIME NOT NULL,
    end_date DATETIME,
    invest_amt DECIMAL(10,2) NOT NULL,
    maintenance_fee DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (cust_id) REFERENCES Customers(cust_id)
)

CREATE TABLE QuartDiv(
    qd_id INT AUTO_INCREAMENT PRIMARY KEY,
    pnote_id INT,
    divi_id INT,
    FOREIGN KEY (pnote_id) REFERENCES Customers(pnote_id),
    FOREIGN KEY (divi_id) REFERENCES Dividends(divi_id)
)

CREATE TABLE Dividends(
    divi_id INT AUTO_INCREAMENT PRIMARY KEY,
    payout_date DATETIME;
    nav_payout DECIMAL(10,2) NOT NULL
)

CREATE TABLE MonthlyComms(
    moncomms_id INT AUTO_INCREAMENT PRIMARY KEY,
    agent_id INT,
    pnote_id INT,
    comms_id,
    FOREIGN KEY (agent_id) REFERENCES Agents(agent_id),
    FOREIGN KEY (pnote_id) REFERENCES Pnotes(pnote_id),
    FOREIGN KEY (comms_id) REFERENCES Commissions(comms_id)

)

CREATE TABLE Commissions(
    comms_id INT AUTO_INCREAMENT PRIMARY KEY,
    comms_desc VARCHAR(25) NOT NULL;
    comms_payout DECIMAL(10,2) NOT NULL
)