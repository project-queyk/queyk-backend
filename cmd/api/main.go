package main

import (
	"log/slog"
	"os"

	"github.com/allisson/go-env"
	"github.com/anthropics/anthropic-sdk-go"
	"github.com/anthropics/anthropic-sdk-go/option"
	"github.com/joho/godotenv"
	expo "github.com/oliveroneill/exponent-server-sdk-golang/sdk"
	"github.com/project-queyk/queyk-backend/internal/envutil"
	"github.com/wneessen/go-mail"
)

func main() {
	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	err := godotenv.Load()
	if err != nil {
		slog.Error("failed to load .env file", "error", err)
	}

	port := env.GetString("PORT", "8080")
	environment := env.GetString("APP_ENV", "development")

	appUrl := envutil.GetRequired("APP_URL")
	dbUrl := envutil.GetRequired("DATABASE_URL")
	smtpEmail := envutil.GetRequired("SMTP_EMAIL")
	smtpPassword := envutil.GetRequired("SMTP_PASSWORD")
	expoToken := envutil.GetRequired("EXPO_ACCESS_TOKEN")
	anthropicKey := envutil.GetRequired("ANTHROPIC_API_KEY")
	schoolEmailAddress := envutil.GetRequired("SCHOOL_EMAIL_ADDRESS")

	anthropicClient := anthropic.NewClient(
		option.WithAPIKey(anthropicKey),
	)
	expoPushClient := expo.NewPushClient(&expo.ClientConfig{
		AccessToken: expoToken,
	})
	mailClient, err := mail.NewClient("smtp.gmail.com",
		mail.WithSMTPAuth(mail.SMTPAuthAutoDiscover),
		mail.WithPort(587),
		mail.WithSMTPAuth(mail.SMTPAuthPlain),
		mail.WithUsername(smtpEmail),
		mail.WithPassword(smtpPassword),
	)
	if err != nil {
		logger.Error("failed to create mail client", "error", err)
	}

	cfg := config{
		addr:               ":" + port,
		env:                environment,
		schoolEmailAddress: schoolEmailAddress,
		appUrl:             appUrl,
		db: dbConfig{
			dsn: dbUrl,
		},
	}

	app := application{
		config:          cfg,
		mailClient:      mailClient,
		anthropicClient: &anthropicClient,
		expoPushClient:  expoPushClient,
	}

	if err := app.run(app.mount()); err != nil {
		slog.Error("server failed to start", "error", err)
		os.Exit(1)
	}
}
