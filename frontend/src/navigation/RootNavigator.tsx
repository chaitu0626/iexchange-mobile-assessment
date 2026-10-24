import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabBarIcon } from "../components/TabBarIcon";
import { colors } from "../components/theme";
import { JobDetailsScreen } from "../screens/JobDetailsScreen";
import { JobsScreen } from "../screens/JobsScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { SignupScreen } from "../screens/SignupScreen";
import type { MainTabParamList, RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tabs.Navigator
      initialRouteName="Jobs"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        animation: "shift",
        transitionSpec: {
          animation: "timing",
          config: {
            duration: 280,
          },
        },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          paddingTop: 7,
        },
      }}
    >
      <Tabs.Screen
        component={JobsScreen}
        name="Jobs"
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon color={color} name="briefcase" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        component={ProfileScreen}
        name="Profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon color={color} name="user" size={size} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.white },
        headerTintColor: colors.blueDark,
        headerTitleStyle: {
          color: colors.navy,
          fontSize: 17,
          fontWeight: "700",
        },
      }}
    >
      <Stack.Screen
        component={MainTabs}
        name="MainTabs"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={JobDetailsScreen}
        name="JobDetails"
        options={({ route }) => ({ title: route.params.title })}
      />
      <Stack.Screen component={LoginScreen} name="Login" options={{ title: "Sign in" }} />
      <Stack.Screen
        component={SignupScreen}
        name="Signup"
        options={{ title: "Create account" }}
      />
    </Stack.Navigator>
  );
}
