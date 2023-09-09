import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import { renderToReadableStream } from "react-dom/server";
import { MDXModule } from "mdx/types";
import { Hello } from "./components/Hello.tsx";

const transmute = async (file: string) => {
  const f = Bun.file(file);
  const content = await f.text();

  const compiled = await evaluate(content, {
    ...(runtime as any),
    useMDXComponents: () => {
      return {
        Hello: Hello,
      };
    },
  });

  return compiled;
};

const Element = (module: MDXModule) => {
  const { default: Children } = module;

  return <Children />;
};

Bun.serve({
  fetch: async (request) => {
    return new Response(
      await renderToReadableStream(Element(await transmute("pages/Hello.mdx")))
    );
  },
});
