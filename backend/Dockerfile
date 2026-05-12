FROM golang:1.19-alpine AS builder

WORKDIR /app

RUN apk add --no-cache gcc musl-dev

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /mock-server ./cmd/mock-server

FROM scratch
COPY --from=builder /mock-server /
EXPOSE 9090

CMD ["/mock-server"]