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
        fontSize: "0.8rem",
      }}
      rehypePlugins={[rehypeKatex]}
    />
  );
}
