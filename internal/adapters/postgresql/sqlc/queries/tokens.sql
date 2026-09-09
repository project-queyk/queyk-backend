-- name: GetTokenByTokenType :one
SELECT * FROM public."token"
WHERE type = $1;
