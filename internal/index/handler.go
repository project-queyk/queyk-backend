package index

import (
	"log/slog"
	"net/http"

	"github.com/project-queyk/queyk-backend/internal/respond"
)

const apiName = "Queyk API"

const version = "1.0.0"

type IndexCheckResponse struct {
	Message     string `json:"message"`
	Version     string `json:"version"`
	Status      string `json:"status"`
	Environment string `json:"environment"`
}

type handler struct {
	service Service
}

func NewHandler(s Service) *handler {
	return &handler{
		service: s,
	}
}

func (h *handler) Index(w http.ResponseWriter, r *http.Request) {
	env := h.service.Index()

	if err := respond.WriteJSON(w, http.StatusOK, IndexCheckResponse{
		Message:     apiName,
		Version:     version,
		Status:      "running",
		Environment: env,
	}); err != nil {
		slog.Error("failed to write index json response", "error", err)
	}
}
