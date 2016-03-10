CREATE TABLE t_restaurant_list(
	id			SERIAL 	PRIMARY KEY,
	name 		VARCHAR,
	img_url 	VARCHAR,
	reg_date 	DATE
);
CREATE TABLE t_lunch_today(
	date  			DATE NOT NULL DEFAULT date(now()),
	restaurant_id 	Integer NOT NULL
);

CREATE TABLE t_user(
	id				SERIAL 	PRIMARY KEY,
	email			VARCHAR NOT NULL,
	name			VARCHAR NOT NULL,
	password		VARCHAR NOT NULL,
	type			VARCHAR,
	token			VARCHAR,
	token_expires 	DATE
);
