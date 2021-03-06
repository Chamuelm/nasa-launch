import {
    _,
    log,
    path,
    Application,
    send,
}  from "./deps.ts";

import api from "./api.ts";

const app = new Application();
const PORT = 8000;

log.setup({
    handlers: {
        console: new log.handlers.ConsoleHandler("INFO")
    },
    loggers: {
        default: {
            level: "INFO",
            handlers: ["console"]
        }
    }
});

app.addEventListener("error", (event) => {
    log.error(event.error);
})

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.response.body = "Internal server error";
        throw err;
    }
})

app.use(async (ctx, next) => {
    await next();
    const time = ctx.response.headers.get("X-Response-Time");
    log.info(`${ctx.request.method} ${ctx.request.url}: ${time}`);
});

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const delta = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${delta}ms`);
});

app.use(api.routes());
app.use(api.allowedMethods());

app.use(async (ctx) => {
    const filePath = ctx.request.url.pathname;
    const fileWhitelist = [
        '/index.html',
        '/images/favicon.png',
        '/videos/space.mp4',
        '/javascripts/script.js',
        '/stylesheets/style.css'
    ];

    if (fileWhitelist.includes(filePath)) {
        await send(ctx, filePath, {
            root: path.join(Deno.cwd(), 'public')
        });
    }
});

if (import.meta.main) {
    log.info(`Starting server in port ${PORT}`);
    await app.listen({
        port: PORT,
    });
}
