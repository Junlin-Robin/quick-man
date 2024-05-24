import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // CI/CD传入的泳道
  const SWIMLANE = process.env.SWIMLANE;
  // 判断是否生产环境
  const isProd = env.REACT_DEPLOY_ENV === 'production';
  // 后缀路径：泳道环境-<SWIMLANE>；主测试环境-main；生产环境-''
  const suffixURL = isProd ? '' : (SWIMLANE || env.REACT_DEPLOY_MAIN_SWIMLANE);
  // 静态资源请求路径：测试环境-</appName/dev/SWIMLANE>；生产环境-</appName>
  const baseURL = `/${env.REACT_APP_NAME}/${isProd ? '' : (env.REACT_DEV_URL_BASE + '/' + suffixURL)}`;

  return {
    plugins: [react()],
    build: {
      outDir: `${env.REACT_BUILD_OUT_DIR}/${suffixURL}`,
    },
    base: baseURL,
    resolve: {
      alias: [
        { find: '@', replacement: resolve(__dirname, 'src') },
        { find: /^~/, replacement: '' },
        { find: 'public', replacement: '' },
      ]
    },
  };
})
