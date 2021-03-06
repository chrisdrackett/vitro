import { startCase } from 'lodash'
import { debug } from './support'

export function makeExperimentsTree(files: string[], basePath: string) {
    debug('makeExperimentsTree')
    const filesParts = files.map((f) => f.split('/')).filter(Boolean)
    const children = arrangeIntoTree(filesParts, basePath)
    return removeSingleChildFolders({
        children,
    })
}

export function arrangeIntoTree(
    paths: string[][],
    basePath: string,
): ExperimentsTree[] {
    // Adapted from http://brandonclapp.com/arranging-an-array-of-flat-paths-into-a-json-tree-like-structure/
    var tree = []

    for (var i = 0; i < paths.length; i++) {
        var path = paths[i]
        var currentLevel = tree
        for (var j = 0; j < path.length; j++) {
            var part = path[j]

            var existingPath = findWhere(currentLevel, 'name', part)

            if (existingPath) {
                currentLevel = existingPath.children
            } else {
                const reconstructedPath = path.slice(0, j + 1).join('/')
                // remove url for non leafs
                const isDir = path[j + 1]
                const url =
                    basePath + '?file=' + encodeURIComponent(reconstructedPath)
                var newPart = {
                    name: part,
                    url: isDir ? '' : url,
                    path: reconstructedPath,
                    title: formatPathToTitle(part),
                    children: [],
                }

                currentLevel.push(newPart)
                currentLevel = newPart.children
            }
        }
    }

    return tree

    function findWhere(array, key, value) {
        // Adapted from https://stackoverflow.com/questions/32932994/findwhere-from-underscorejs-to-jquery
        let t = 0 // t is used as a counter
        while (t < array.length && array[t][key] !== value) {
            t++
        } // find the index where the id is the as the aValue

        if (t < array.length) {
            return array[t]
        } else {
            return false
        }
    }
}

function formatPathToTitle(path: string) {
    const endPath = path
        .split('/')
        .map((x) => x.trim())
        .filter(Boolean)
        .reverse()[0]
    const withoutExt = endPath.split('.')[0]
    return startCase(withoutExt)
}

const DUMMY_NAMES = ['index', 'experiment', 'story']

export function removeSingleChildFolders(tree): ExperimentsTree {
    tree = tree || {}
    if (!tree?.children || !tree?.children?.length) {
        return tree
    }
    if (tree?.children?.length === 1) {
        if (tree?.children[0].children?.length) {
            return removeSingleChildFolders({
                ...tree,
                children: tree.children[0]?.children || [],
            })
        } else if (
            DUMMY_NAMES.includes(tree.children[0]?.title?.toLowerCase?.())
        ) {
            // leaf with a dummy name
            const isDir = !tree.url
            return removeSingleChildFolders({
                ...tree,
                url: isDir ? tree.children[0]?.url : tree.url,
                path: isDir ? tree.children[0]?.path : tree.path,
                children: [],
            })
        }
    }
    const children = tree.children.map((x) => {
        return removeSingleChildFolders(x)
    })
    return { ...tree, children }
}

export interface ExperimentsTree {
    path?: string
    name?: string
    children?: ExperimentsTree[]
    url?: string
    title?: string
    // meta?: Record<string, any>
}

export function bfs(tree: ExperimentsTree): ExperimentsTree[] {
    const results = []
    // tree.depth = 0
    var queue = [tree]
    var n: ExperimentsTree

    while (queue.length > 0) {
        n = queue.shift()
        results.push(n)

        if (!n.children) {
            continue
        }
        for (var i = 0; i < n.children.length; i++) {
            const child = n.children[i]
            // child.depth = (n.depth || 0) + 1
            queue.push(child)
        }
    }
    return results
}
