import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function AppHeader({
  title = "LLM economy",
  right,
}: {
  title?: string;
  right?: React.ReactNode;
}) {
  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: "white" }}>
      <View className="flex-row items-center justify-between px-4 border-gray-stroke-100 h-14 bg-white border-b">
        <Text className="body1-regular font-extralight">{title}</Text>
        {right ?? <View style={{ width: 24 }} />}
      </View>
    </SafeAreaView>
  );
}
