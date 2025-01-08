CREATE DATABASE mgmtFundOverview;

USE mgmtFundOverview;

create table Customers (
    cust_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    cFirst_name VARCHAR(255) NOT NULL,
    cLast_name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    NRIC VARCHAR(16) NOT NULL,
    gender CHAR NOT NULL,
    addr_1 VARCHAR(45) NOT NULL,
    addr_2 VARCHAR(45) NOT NULL,
    zipcode VARCHAR(10) NOT NULL,
    cEmail VARCHAR(100) NOT NULL
);

CREATE TABLE Agents(
    agent_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    aFirst_name VARCHAR(255) NOT NULL,
    aLast_name VARCHAR(255) NOT NULL,
    aEmail VARCHAR(100) NOT NULL,
    join_date DATETIME NOT NULL
);

CREATE TABLE Banks(
    bank_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    bank_name VARCHAR(255) NOT NULL, 
    bank_num INT NOT NULL,
    addr_1 VARCHAR(45) NOT NULL,
    addr_2 VARCHAR(45) NOT NULL,
    zipcode VARCHAR(10) NOT NULL,
    swift_code VARCHAR(16) NOT NULL
);

CREATE TABLE Pnotes(
    pnote_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    pstart_date DATE NOT NULL,
    pend_date DATE,
    invest_amt DECIMAL(10,2) NOT NULL,
    maintenance_fee DECIMAL(10,2) NOT NULL
);


CREATE TABLE Dividends(
    divi_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    payout_date DATE,
    nav_payout DECIMAL(10,2) NOT NULL
);

CREATE TABLE MonthlyComms(
    moncomms_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    comms_base DECIMAL (10,2) NOT NULL
);


alter table Pnotes add column cust_id INT UNSIGNED; 
alter table Pnotes add column bank_id INT UNSIGNED;
alter table Pnotes add column divi_id int UNSIGNED;
alter table Pnotes add column agent_id int UNSIGNED;
alter table Pnotes add constraint fk_pnote_customer FOREIGN KEY(cust_id) REFERENCES Customers(cust_id);
alter table Pnotes add constraint fk_pnote_bank FOREIGN KEY (bank_id) REFERENCES Banks(bank_id);
alter table Pnotes add constraint fk_pnote_dividend FOREIGN KEY(divi_id)REFERENCES Dividends(divi_id);
alter table Pnotes add constraint fk_pnote_agent FOREIGN KEY(agent_id)REFERENCES Agents(agent_id);



alter table MonthlyComms add column pnote_id INT UNSIGNED;
alter table MonthlyComms add column agent_id INT UNSIGNED;
alter table MonthlyComms add constraint fk_monthlycomms_pnote FOREIGN KEY(pnote_id) REFERENCES Pnotes(pnote_id);
alter table MonthlyComms add constraint fk_monthlycomms_agent FOREIGN KEY (agent_id) REFERENCES Agents(agent_id);
