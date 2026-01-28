import MDEditor from "@uiw/react-md-editor";
import { ComponentProps } from "react";
import rehypeKatex from "rehype-katex";

interface Props extends ComponentProps<typeof MDEditor.Markdown> {
  className?: string;
  content: string;
}

export default function MarkdownItem(props: Props) {
  return (
    <MDEditor.Markdown
      source={props.content}
      style={{
        backgroundColor: "transparent",
        color: "inherit",
        padding: 0,
        fontSize: "0.9rem",
        wordBreak: "keep-all",
      }}
      rehypePlugins={[rehypeKatex]}
      components={{
        ul: (props) => <ul className="pl-4! list-disc" {...props} />,
        hr: (props) => <hr className="h-px! border-none! bg-gray-300!" {...props} />,
        h2: (props) => <h2 className="border-none!" {...props} />,
      }}
    />
  );
}
