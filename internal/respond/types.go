package respond

type APIResponse struct {
	Message    string  `json:"message"`
	StatusCode int     `json:"statusCode"`
	Error      *string `json:"error,omitempty"`
}
