module.exports = {
  apps: [{
    name: 'infinity-app',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: '/var/www/infinity-app',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    watch: false,
    instances: 1,
    autorestart: true,
    max_memory_restart: '500M',
  }],
}
