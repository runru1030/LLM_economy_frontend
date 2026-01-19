import { View, type ViewProps } from "react-native";

import clsx from "clsx";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  className,
  ...otherProps
}: ThemedViewProps) {
  return <View {...otherProps} className={clsx(className, "bg-white")} />;
}
