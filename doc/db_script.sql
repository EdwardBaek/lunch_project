CREATE TABLE t_restaurant_list(
	id			SERIAL 	PRIMARY KEY,
	name 		VARCHAR,
	img_url 	VARCHAR,
	reg_date 	DATE
);
CREATE TABLE t_lunch_today(
	date  			DATE NOT NULL DEFAULT date(now()),
	restaurant_id 	Integer NOT NULL
)