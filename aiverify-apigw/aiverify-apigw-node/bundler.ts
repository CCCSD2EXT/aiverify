import path from "path";
import { bundleMDX } from "mdx-bundler";
import rehypeMdxImportMedia from "rehype-mdx-import-media";
import remarkGfm from "remark-gfm";

export async function bundleWidgetMDX(
  scriptPath: string
): Promise<ReturnType<typeof bundleMDX>> {
  const result = await bundleMDX({
    // cwd: pluginPath,
    file: scriptPath,
    // globals: {'MyCheckbox':'MyCheckbox'},
    // globals: {'ai-verify-shared-library/charts':'ai-verify-shared-library/charts'},
    mdxOptions: (options) => {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        rehypeMdxImportMedia,
        remarkGfm,
      ];
      return options;
    },
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        ".png": "dataurl",
      };
      options.nodePaths = [path.resolve(process.cwd(), "node_modules")];
      // options.external = ["aiverify-shared-library/*", "moment"]; //TODO - figure out how to optimize this by dynamic import or separate bundle if possible
      return options;
    },
  });
  // console.log("validateMDX result", result)
  return result;
}

export async function bundleSummaryMDX(
  scriptPath: string
): Promise<ReturnType<typeof bundleMDX>> {
  const result = await bundleMDX({
    file: scriptPath,
  });
  // console.log("validateMDX result", result)
  return result;
}
