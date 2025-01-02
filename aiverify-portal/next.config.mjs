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
        source: '/api/test_models/:id',
        destination: `${process.env.APIGW_HOST}/test_models/:id`,
      },
      {
        source: '/api/test_models/exportModelAPI/:id',
        destination: `${process.env.APIGW_HOST}/test_models/exportModelAPI/:id`,
      },
      {
        source: '/api/test_models/download/:id',
        destination: `${process.env.APIGW_HOST}/test_models/download/:id`,
      },
      {
        source: '/api/test_models/upload',
        destination: `${process.env.APIGW_HOST}/test_models/upload`,
      },
      {
        source: '/api/test_models/upload_folder',
        destination: `${process.env.APIGW_HOST}/test_models/upload_folder`,
      },
      {
        source: '/api/test_models/modelapi',
        destination: `${process.env.APIGW_HOST}/test_models/modelapi`,
      },
    ];
  },
};

export default nextConfig;
