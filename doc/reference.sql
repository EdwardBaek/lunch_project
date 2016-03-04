CREATE TABLE restaurant_list
(
	id 		SERIAL  PRIMARY KEY,
	name 	VARCHAR UNIQUE,
	img 	VARCHAR
);


CREATE TABLE today
(
	day 			DATE 	NOT NULL DEFAULT date(now()),	
	restaurant_id 	Integer NOT NULL,	
	primary key (day, restaurant_id)
);


INSERT INTO restaurant_list(name, img) VALUES ('우리집', 'img/1.png');
INSERT INTO restaurant_list(name, img) VALUES ('봉평고향 메밀촌', 'img/2.png');
INSERT INTO restaurant_list(name, img) VALUES ('부대찌개', 'img/3.png');
INSERT INTO restaurant_list(name, img) VALUES ('김치찜', 'img/4.png');
INSERT INTO restaurant_list(name, img) VALUES ('북창동 순두부', 'img/5.png');
INSERT INTO restaurant_list(name, img) VALUES ('한성돈까스', 'img/6.png');
INSERT INTO restaurant_list(name, img) VALUES ('교동짬뽕', 'img/7.png');
INSERT INTO restaurant_list(name, img) VALUES ('명동칼국수 샤브샤브', 'img/8.png');


INSERT INTO today(restaurant_id) VALUES (1);