-- UI v3 fields (run once against Neon / Postgres)
alter table projects add column if not exists summary varchar;
alter table site_settings add column if not exists hero_video_id integer;
