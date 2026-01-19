import { WebView, WebViewMessageEvent } from "react-native-webview";
import { StackActions, useNavigation } from "@react-navigation/native";

export function WebViewContiner({ baseURL }: { baseURL: string }) {
  const navigation = useNavigation();
  const requestOnMessage = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === "ROUTER_EVENT") {
        const { method, path, screenName, data } = message;

        switch (method) {
          case "PUSH":
            navigation.dispatch(
              StackActions.push(screenName ?? "WebView", {
                url: path,
                ...data,
              })
            );
            break;
          case "REPLACE":
            navigation.dispatch(
              StackActions.replace(screenName ?? "WebView", {
                url: path,
                ...data,
              })
            );
            break;
          case "GO_BACK":
            navigation.goBack();
            break;
          case "GO_FORWARD":
            // forward는 history 관리 직접 해야해서 (생략)
            break;
        }
      }
    } catch (err) {
      console.warn("Invalid message format", err);
    }
  };

  return (
    <WebView
      allowsBackForwardNavigationGestures={true}
      bounces={false}
      source={{ uri: baseURL }}
      onMessage={requestOnMessage}
    />
  );
}
