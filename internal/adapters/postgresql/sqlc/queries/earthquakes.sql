-- name: GetAllEarthquakes :many
SELECT * FROM public."earthquake";

-- name: GetAllStartEndEarthquakes :many
SELECT * FROM public."earthquake"
WHERE created_at >= $1 AND created_at <= $2;
