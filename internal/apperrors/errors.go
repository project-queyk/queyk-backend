package apperrors

import (
	"net/http"
)

type AppError struct {
	Message    string `json:"message"`
	Code       string `json:"code,omitempty"`
	StatusCode int    `json:"statusCode"`
}

func (e *AppError) Error() string { return e.Message }

var (
	ErrInternalServerError = AppError{
		Message:    "Internal server error",
		Code:       "internal_error",
		StatusCode: http.StatusInternalServerError}
	ErrInvalidToken = AppError{
		Message:    "Invalid or expired token.",
		Code:       "invalid_token",
		StatusCode: http.StatusUnauthorized}
	ErrMissingIDParam = AppError{
		Message:    "ID parameter is required.",
		Code:       "missing_id_param",
		StatusCode: http.StatusBadRequest}
	ErrMissingBody = AppError{
		Message:    "Request body is required.",
		Code:       "missing_request_body",
		StatusCode: http.StatusBadRequest}
	ErrUserNotFound = AppError{
		Message:    "User not found.",
		Code:       "user_not_found",
		StatusCode: http.StatusNotFound}
	ErrUnauthorizedAccess = AppError{
		Message:    "Forbidden.",
		Code:       "access_denied",
		StatusCode: http.StatusForbidden}
	ErrBadRequest = AppError{
		Message:    "Bad request.",
		Code:       "bad_request",
		StatusCode: http.StatusBadRequest}
)
