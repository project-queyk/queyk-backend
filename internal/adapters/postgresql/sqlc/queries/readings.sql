-- name: GetAllReadings :many
SELECT * FROM public."reading";

-- name: GetAllStartEndReadings :many
SELECT * FROM public."reading"
WHERE created_at >= $1 AND created_at <= $2;

-- name: GetFirstDataDate :one
SELECT created_at AS first_date FROM public."reading"
ORDER BY created_at ASC
LIMIT 1;

-- name: GetBatteryLevel :one
SELECT battery, created_at FROM public."reading"
ORDER BY created_at DESC
LIMIT 1;
