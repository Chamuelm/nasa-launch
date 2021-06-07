FROM denoland/deno:alpine-1.10.3

WORKDIR /app

USER deno

COPY deps.ts .
RUN deno cache deps.ts

ADD . .

RUN deno cache mod.ts

CMD ["run", "--allow-net", "--allow-read", "/app/mod.ts"]

EXPOSE 8000