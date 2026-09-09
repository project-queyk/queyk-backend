-- name: GetUserByEmailAndOauthId :one
SELECT * FROM public."user"
WHERE email = $1 AND oauth_id = $2;
