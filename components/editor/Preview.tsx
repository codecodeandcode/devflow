import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

export default function Preview({ content = "" }: { content: string }) {
  const formattedContent = content
    .replace(/\\/g, "")
    .replace(/&#x20;/g, "")
    // 转义花括号，防止 MDX 将其解析为 JSX 表达式
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    // 转义 < 后跟字母的情况，防止 MDX 将其解析为 JSX 组件
    .replace(/<(?=[a-zA-Z])/g, "\\<");

  return (
    <section className="markdown prose grid break-words">
      <MDXRemote
        source={formattedContent}
        components={{
          pre: (props) => (
            <Code
              {...props}
              lineNumbers
              className="shadow-light-200 dark:shadow-dark-200"
            />
          ),
        }}
      />
    </section>
  );
}
