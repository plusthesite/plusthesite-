/**
 * PM2 process definition for the VPS, as an alternative to the Docker image.
 *
 * Deploy shape: build on the box (or in CI), then run the traced standalone
 * server. `.next/standalone/server.js` needs `.next/static` and `public/`
 * copied next to it - see docs/DEPLOY-VPS.md.
 *
 *   pm2 start ecosystem.config.cjs --env production
 *   pm2 reload plus-site        # zero-downtime after a new build
 */
module.exports = {
    apps: [
        {
            name: "plus-site",
            script: ".next/standalone/server.js",
            // One worker per core. The app is stateless apart from the
            // in-memory rate limiter, whose counters are per worker - see the
            // note in src/lib/rateLimit.ts before raising this.
            instances: 1,
            exec_mode: "fork",
            env_production: {
                NODE_ENV: "production",
                PORT: 3000,
                HOSTNAME: "127.0.0.1",
                NEXT_TELEMETRY_DISABLED: "1",
            },
            // Secrets come from the shell/systemd environment, never from here.
            max_memory_restart: "512M",
            kill_timeout: 10000,
            wait_ready: false,
            autorestart: true,
            merge_logs: true,
            time: true,
        },
    ],
};
