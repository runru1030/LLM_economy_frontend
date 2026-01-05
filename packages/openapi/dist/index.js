import { makeBaseClientString, makeDeclareString, makeUseMutationString, makeUseQueryString, } from "./make.js";
import { program } from "commander";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
function parseEndpoint(node, queryPath, mutationPath) {
    if (!ts.isPropertyName(node.name)) {
        throw new Error("Invalid property name");
    }
    const endpoint = node.name.getText().replace(/^['"]|['"]$/g, "");
    node.forEachChild((node) => {
        if (ts.isTypeLiteralNode(node)) {
            node.forEachChild((node) => {
                if (ts.isPropertySignature(node)) {
                    const propertyText = node.getText();
                    if (propertyText.endsWith("never;") ||
                        propertyText.startsWith("parameters:")) {
                        return;
                    }
                    const operationIdExtract = /operations\["(.+)"]/g.exec(node.getText());
                    const operationId = operationIdExtract ? operationIdExtract[1] : null;
                    const method = node.name.getText();
                    const deprecated = node.getFullText().includes("@deprecated");
                    if (method === "get") {
                        const mq = makeUseQueryString(endpoint, {
                            operationId,
                            deprecated,
                        });
                        if (mq) {
                            const functionFilePath = path.join(queryPath, `${mq.hookName}.ts`);
                            if (fs.existsSync(functionFilePath)) {
                                throw Error(`File already exists: ${functionFilePath}`);
                            }
                            void fs.writeFileSync(functionFilePath, mq.functionString, {
                                encoding: "utf-8",
                            });
                        }
                    }
                    else {
                        const ms = makeUseMutationString(method, endpoint, {
                            operationId,
                            deprecated,
                        });
                        if (ms) {
                            const functionFilePath = path.join(mutationPath, `${ms.hookName}.ts`);
                            if (fs.existsSync(functionFilePath)) {
                                throw Error(`File already exists: ${functionFilePath}`);
                            }
                            void fs.writeFileSync(functionFilePath, ms.functionString, {
                                encoding: "utf-8",
                            });
                        }
                    }
                }
            });
        }
    });
}
function parseDeclare(declareString, queryPath, mutationPath) {
    ts.createSourceFile("test.ts", declareString, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS).forEachChild((node) => {
        if (ts.isInterfaceDeclaration(node)) {
            if (node.name.escapedText.toString() === "paths") {
                node.forEachChild((node) => {
                    if (ts.isPropertySignature(node)) {
                        parseEndpoint(node, queryPath, mutationPath);
                    }
                });
            }
        }
    });
}
program
    .option("-i, --input <char>", "openapi 주소나 json 파일 경로")
    .option("-o, --output <char>", "생성된 openapi 저장 경로")
    .action(async (str) => {
    if (!str.input) {
        throw new Error("--input 이 필요합니다.");
    }
    if (!str.output) {
        throw new Error("--output 이 필요합니다.");
    }
    const BASE_PATH = path.join(path.resolve(), str.output);
    const QUERY_PATH = path.join(BASE_PATH, "query");
    const MUTATION_PATH = path.join(BASE_PATH, "mutation");
    fs.rmSync(QUERY_PATH, { recursive: true, force: true });
    fs.rmSync(MUTATION_PATH, { recursive: true, force: true });
    fs.mkdirSync(QUERY_PATH, { recursive: true });
    fs.mkdirSync(MUTATION_PATH, { recursive: true });
    let declareString = await makeDeclareString(str.input);
    // https://github.com/openapi-ts/openapi-typescript/issues/1723 (204 문제만 해결 할 수 있도록 임시 수정)
    declareString = declareString.replace(/content\?: never;/gi, `content: { "application/json": Record<string, undefined> };`);
    const baseClientString = makeBaseClientString();
    fs.writeFileSync(path.join(BASE_PATH, "paths.d.ts"), declareString, {
        encoding: "utf-8",
    });
    fs.writeFileSync(path.join(BASE_PATH, "base.client.ts"), baseClientString, {
        encoding: "utf-8",
    });
    parseDeclare(declareString, QUERY_PATH, MUTATION_PATH);
});
program.parse();
