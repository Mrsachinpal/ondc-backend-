module.exports = {
    apps: [
      {
        name: "sellerapp-ondc",
        script: "./index.js",
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G'
      },
    ],
  };
  