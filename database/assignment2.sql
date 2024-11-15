insert into public.account (account_firstname, account_lastname, account_email, account_password) values
('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

update public.account
set account_type = 'Admin'
where account_id = 1;

delete from public.account where account_id = 1;

update public.inventory
set inv_description = replace(inv_description, 'small interiors', 'a huge interior')
where inv_make = 'GM' and inv_model = 'Hummer';

select *
from public.classification c
join public.inventory i
	on c.classification_id = i.classification_id
where classification_name = 'Sport';

update public.inventory
set inv_image = replace(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = replace(inv_thumbnail, '/images', '/images/vehicles');