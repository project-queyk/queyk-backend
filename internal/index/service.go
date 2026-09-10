package index

type Service interface {
	Index() string
}

type svc struct {
	env string
}

func NewService(env string) *svc {
	return &svc{
		env: env,
	}
}

func (s *svc) Index() string {
	return s.env
}
