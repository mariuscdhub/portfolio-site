self.addEventListener("install", (event) => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
    // Pass-through fetch (required for Chrome installability prompt)
    event.respondWith(
        fetch(event.request).catch(
            () => new Response("Vous êtes hors ligne.", {
                status: 503,
                headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            })
        )
    );
});
