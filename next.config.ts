module.exports = {
  webpack: (config: any, { dev }: any) => {
    if (dev) {
      config.devtool = "source-map"; 
    }
    return config;
  },
};
