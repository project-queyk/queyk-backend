package main

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/anthropics/anthropic-sdk-go"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jackc/pgx/v5"
	expo "github.com/oliveroneill/exponent-server-sdk-golang/sdk"
	"github.com/project-queyk/queyk-backend/internal/index"
	"github.com/wneessen/go-mail"
)

type dbConfig struct {
	dsn string
}

type config struct {
	addr               string
	env                string
	schoolEmailAddress string
	appUrl             string
	db                 dbConfig
}

type application struct {
	expoPushClient  *expo.PushClient
	mailClient      *mail.Client
	anthropicClient *anthropic.Client
	db              *pgx.Conn
	config          config
}

func (app *application) mount() http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{app.config.appUrl},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))
	r.Use(middleware.Timeout(60 * time.Second))

	idxSvc := index.NewService(app.config.env)
	idxHandler := index.NewHandler(idxSvc)
	r.Get("/", idxHandler.Index)

	return r
}

func (app *application) run(h http.Handler) error {
	srv := &http.Server{
		Addr:         app.config.addr,
		Handler:      h,
		WriteTimeout: time.Second * 30,
		ReadTimeout:  time.Second * 10,
		IdleTimeout:  time.Minute,
	}

	slog.Info("starting server", "addr", srv.Addr, "env", app.config.env)

	return srv.ListenAndServe()
}
