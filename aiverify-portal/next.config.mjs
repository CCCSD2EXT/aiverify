/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/test_results/upload',
        destination: `${process.env.APIGW_HOST}/test_results/upload`,
      },
      {
        source: '/api/test_results/upload_zip',
        destination: `${process.env.APIGW_HOST}/test_results/upload_zip`,
      },
      {
        source: '/api/input_block_data/:id',
        destination: `${process.env.APIGW_HOST}/input_block_data/:id`,
      },
      {
        source: '/api/plugins/:gid/bundle/:cid',
        destination: `${process.env.APIGW_HOST}/plugins/:gid/bundle/:cid`,
      },
      {
        source: '/api/plugins/:gid/summary/:cid',
        destination: `${process.env.APIGW_HOST}/plugins/:gid/summary/:cid`,
      },
    ];
  },
};

export default nextConfig;
