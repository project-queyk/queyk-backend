-- name: CreateEarthquake :one
INSERT INTO public."earthquake" (
    magnitude, duration
) VALUES (
    $1, $2
)
RETURNING *;

-- name: GetEarthquake :one
SELECT * FROM public."earthquake"
WHERE id = $1;

-- name: ListEarthquakes :many
SELECT * FROM public."earthquake";

-- name: ListEarthquakesByDateRange :many
SELECT * FROM public."earthquake"
WHERE created_at >= $1 AND created_at <= $2;
