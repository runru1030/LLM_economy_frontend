import { Dimensions } from "react-native";

import { WebViewContiner } from "@shared/ui/web-view-container";
import { ThemedView } from "../../shared/ui/themed-view";
import clsx from "clsx";
const windowHeight = Dimensions.get("window").height;
export default function HomeScreen() {
  return (
    <ThemedView className={clsx("flex-1", `h-[${windowHeight}px]`)}>
      <WebViewContiner baseURL="http://192.168.10.13:3000/summary" />
    </ThemedView>
  );
}
