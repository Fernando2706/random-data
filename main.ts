import {Application, Router} from "oak";
import {pokemons,quotes, users }  from "./data.ts"
const app = new Application();

// Cors
app.use(async (ctx, next) => {
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    await next();
});

// Error Handler
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.response.body = "Internal server error";
        ctx.response.status = 500;
        throw err;
    }
});

// Logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Routes
const router = new Router();
router.get("/", (ctx) => {
    ctx.response.body = "Hello World!";
});

// Get /pokemon?page=1&query=fire
router.get("/pokemon", (ctx) => {
    const page = ctx.request.url.searchParams.get("page") || 1;
    const query = ctx.request.url.searchParams.get("query") || "";

    const perPage = 5;
    const offset = (Number(page) - 1) * perPage;
    const pokemonsFiltered = pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(query.toLowerCase()));
    ctx.response.body = pokemonsFiltered.slice(offset, offset + perPage);
})

// Get /qoutes?page=1&query=qoute

router.get("/quotes", (ctx) => {
    const page = ctx.request.url.searchParams.get("page") || 1;
    const query = ctx.request.url.searchParams.get("query") || "";

    const perPage = 5;
    const offset = (Number(page) - 1) * perPage;
    const quotesFiltered = quotes.filter((quote) => quote.quote.toLowerCase().includes(query.toLowerCase()));
    ctx.response.body = quotesFiltered.slice(offset, offset + perPage);
})

// Get /users?page=1&query=user
router.get("/users", (ctx) => {
    const page = ctx.request.url.searchParams.get("page") || 1;
    const query = ctx.request.url.searchParams.get("query") || "";

    const perPage = 5;
    const offset = (Number(page) - 1) * perPage;
    const usersFiltered = users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));
    ctx.response.body = usersFiltered.slice(offset, offset + perPage);
})

app.use(router.routes());

// Run the server
await app.listen({ port: 8080 });