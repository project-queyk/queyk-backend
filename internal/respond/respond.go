package respond

import (
	"bytes"
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"

	"github.com/project-queyk/queyk-backend/internal/apperrors"
)

func WriteJSON[T comparable](w http.ResponseWriter, status int, data T) error {
	var buf bytes.Buffer

	if err := json.NewEncoder(&buf).Encode(data); err != nil {
		slog.Error("failed to encode JSON", "error", err.Error())
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, err := w.Write(buf.Bytes())
	if err != nil {
		slog.Error("failed to write response", "error", err.Error())
		return err
	}

	return nil
}

func ReadJSON[T any](r *http.Request, data *T) error {
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	return decoder.Decode(data)
}

func WritePlainText(w http.ResponseWriter, status int, body string) error {
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.WriteHeader(status)
	_, err := w.Write([]byte(body))

	if err != nil {
		return err
	}

	return nil
}

func WriteErrorResponse(w http.ResponseWriter, err error) error {
	slog.Error("request failed", "error", err.Error())

	appErr, ok := errors.AsType[*apperrors.AppError](err)
	if !ok {
		return WriteJSON(w, apperrors.ErrInternalServerError.StatusCode, apperrors.ErrInternalServerError)
	}

	return WriteJSON(w, appErr.StatusCode, appErr)
}
