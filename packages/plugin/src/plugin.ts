import { Plugin, Config as BundlessConfig } from '@bundless/cli'
import { escapeRegExp } from 'lodash'
import memoize from 'memoizee'
import path from 'path'
import { EXPERIMENTS_TREE_PATH, VIRTUAL_INDEX_PATH } from './constants'
import { generate } from './generate'
import { transformInlineMarkdown } from './docs'

export interface VitroConfig {
    globs: string[]
    ignore?: string[]
    basePath?: string
    bundlessConfig?: BundlessConfig
}

interface PluginArgs {
    config: VitroConfig
    experimentsFilters: string[]
}

export function VitroPlugin(args: PluginArgs): Plugin {
    const { config, experimentsFilters } = args
    const generateCode = memoize((root) =>
        generate({ config, root, experimentsFilters }),
    )
    return {
        name: 'vitro',
        setup({ ctx: { root }, onTransform, onResolve, onLoad }) {
            // TODO invalidate cache on file changes
            onResolve({ filter: /\.html$/ }, (args) => {
                return { path: path.resolve(root, args.path) }
            })
            onLoad({ filter: /\.html$/ }, (args) => {
                return { contents: htmlTemplate }
            })

            // resolve react and react-dom to root to prevent duplication
            // TODO add react aliases after esbuild allows resolve overrides https://github.com/evanw/esbuild/issues/501
            // onResolve({ filter: /^(react|react-dom)/ }, async (args) => {
            //     const resolved = await resolveAsync(args.path, {
            //         basedir: root,
            //         extensions: ['.js', '.cjs'],
            //         preserveSymlinks: false,
            //         mainFields: MAIN_FIELDS,
            //     })
            //     if (resolved) {
            //         return {
            //             path: resolved,
            //         }
            //     }
            // })

            onTransform({ filter: /\.(tsx?|jsx)$/ }, (args) => {
                // TODO only run if there is an import to docs
                if (!args.contents.includes('docs`')) {
                    return
                }
                const contents = transformInlineMarkdown(args.contents)
                return {
                    contents,
                }
            })

            onResolve(
                { filter: new RegExp(escapeRegExp(VIRTUAL_INDEX_PATH)) },
                (args) => {
                    return {
                        path: path.resolve(root, VIRTUAL_INDEX_PATH),
                    }
                },
            )
            onLoad(
                { filter: new RegExp(escapeRegExp(VIRTUAL_INDEX_PATH)) },
                async (args) => {
                    const { virtualIndexCode } = await generateCode(root)
                    return {
                        contents: virtualIndexCode,
                        loader: 'jsx',
                    }
                },
            )
            onResolve(
                { filter: new RegExp(escapeRegExp(EXPERIMENTS_TREE_PATH)) },
                (args) => {
                    return {
                        path: path.resolve(root, EXPERIMENTS_TREE_PATH),
                    }
                },
            )
            onLoad(
                { filter: new RegExp(escapeRegExp(EXPERIMENTS_TREE_PATH)) },
                async (args) => {
                    const { experimentsTree } = await generateCode(root)
                    const contents = `export default ${JSON.stringify(
                        experimentsTree,
                        null,
                        4,
                    )}`
                    return {
                        contents,
                        loader: 'js',
                    }
                },
            )
        },
    }
}

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
            name="description"
            content="Vitro"
        />
        <title>Vitro</title>
    </head>
    <body>
        <div id="root"></div>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <script>window.global = window</script>
        <script type="module" src="/${VIRTUAL_INDEX_PATH}?namespace=file"></script>
    </body>
</html>
`
