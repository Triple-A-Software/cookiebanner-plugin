set dotenv-load := true

dev:
    cargo watch -x run

create-migration name:
    sqlx migrate add {{name}}

reset-db:
    sqlx database reset

build:
    cargo build --release
