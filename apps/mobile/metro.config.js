const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Find the workspace root, this can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(__dirname, "../..");
const projectRoot = __dirname;

const MetroSymlinksResolver = require("@rnx-kit/metro-resolver-symlinks");
const symlinksResolver = MetroSymlinksResolver();

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages, and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;
/**
 * React Native has very frail symlink support for modern monorepo tools
 * that rely on symlinks and global caches to dramatically increase the
 * performance of installs e.g. pnpm. The best way around this is using
 * Microsoft's rnx-kit. I've written more extensively about this in the
 * README.
 *
 * @see https://gist.github.com/Zn4rK/ed60c380e7b672e3089074f51792a2b8
 */
config.resolver.resolveRequest = (context, moduleName, platform) => {
  try {
    // Symlinks resolver throws when it can't find what we're looking for.
    const res = symlinksResolver(context, moduleName, platform);

    if (res) {
      return res;
    }
  } catch {
    /**
     * If we have an error, we pass it on to the next resolver in the chain,
     * which should be one of expos.
     * @see https://github.com/expo/expo/blob/9c025ce7c10b23546ca889f3905f4a46d65608a4/packages/%40expo/cli/src/start/server/metro/withMetroResolvers.ts#L47
     */
    return context.resolveRequest(context, moduleName, platform);
  }
};
module.exports = config;
