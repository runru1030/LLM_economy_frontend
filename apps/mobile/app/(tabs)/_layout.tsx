import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@shared/ui/haptic-tab";
import { Colors } from "@constants/theme";
import { useColorScheme } from "@hooks/use-color-scheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tabIconSelected,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          elevation: 0,
          borderTopWidth: 0,
          backgroundColor: "transparent",
        },
        tabBarBackground: () => (
          <View className="flex-1 bg-white border-none">
            <View className="flex-1 rounded-2xl border border-gray-stroke-100 bg-white" />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color }) => (
            <MaterialIcons color={color} size={20} name={"home-filled"} />
          ),
        }}
      />
    </Tabs>
  );
}
