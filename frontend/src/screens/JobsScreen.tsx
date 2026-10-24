import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../components/theme";
import { useAuth } from "../context/AuthContext";
import { useSavedJobs } from "../context/SavedJobsContext";
import { AllJobsScreen } from "./AllJobsScreen";
import { SavedJobsScreen } from "./SavedJobsScreen";
import type { MainTabParamList, RootStackParamList } from "../types/navigation";

type JobsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Jobs">,
  NativeStackScreenProps<RootStackParamList>
>;

type JobsTab = "all" | "saved";

export function JobsScreen({ navigation, route }: JobsScreenProps) {
  const [selectedTab, setSelectedTab] = useState<JobsTab>("all");
  const { isAuthenticated } = useAuth();
  const { refreshSavedJobs, toggleSavedJob } = useSavedJobs();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const pageWidth = windowWidth - 24;
  const [translateX] = useState(() => new Animated.Value(0));

  useEffect(() => {
    return navigation.addListener("focus", () => {
      const requestedTab = route.params?.openJobsTab;
      if (requestedTab) {
        setSelectedTab(requestedTab);
        navigation.setParams({ openJobsTab: undefined });
      }
    });
  }, [navigation, route.params?.openJobsTab]);

  useEffect(() => {
    const animation = Animated.timing(translateX, {
      toValue: selectedTab === "saved" ? -pageWidth : 0,
      duration: 280,
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
  }, [pageWidth, selectedTab, translateX]);

  useEffect(() => {
    if (selectedTab === "saved" && isAuthenticated) {
      void refreshSavedJobs();
    }
  }, [isAuthenticated, refreshSavedJobs, selectedTab]);

  const handleJobPress = useCallback(
    (jobId: string) => navigation.navigate("JobDetails", { jobId }),
    [navigation]
  );

  const handleSaveJob = useCallback(async (jobId: string) => {
    if (!isAuthenticated) {
      Alert.alert(
        "Login required",
        "Please log in or create an account to save jobs.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Login",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
      return;
    }

    try {
      await toggleSavedJob(jobId);
    } catch (error) {
      Alert.alert(
        "Could not update saved job",
        error instanceof Error ? error.message : "Please try again."
      );
    }
  }, [isAuthenticated, navigation, toggleSavedJob]);

  return (
    <View style={styles.screen}>
      <View style={[styles.content, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>Opportunities</Text>

        <View accessibilityRole="tablist" style={styles.tabs}>
          <TouchableOpacity
            accessibilityRole="tab"
            accessibilityState={{ selected: selectedTab === "all" }}
            onPress={() => setSelectedTab("all")}
            style={[styles.tab, selectedTab === "all" && styles.selectedTab]}
          >
            <Text
              style={[
                styles.tabLabel,
                selectedTab === "all" && styles.selectedTabLabel,
              ]}
            >
              All Jobs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="tab"
            accessibilityState={{ selected: selectedTab === "saved" }}
            onPress={() => setSelectedTab("saved")}
            style={[styles.tab, selectedTab === "saved" && styles.selectedTab]}
          >
            <Text
              style={[
                styles.tabLabel,
                selectedTab === "saved" && styles.selectedTabLabel,
              ]}
            >
              Saved Jobs
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.paneViewport, { width: pageWidth }]}>
          <Animated.View
            style={[
              styles.paneTrack,
              {
                transform: [{ translateX }],
                width: pageWidth * 2,
              },
            ]}
          >
            <View
              accessibilityElementsHidden={selectedTab !== "all"}
              importantForAccessibility={
                selectedTab === "all" ? "auto" : "no-hide-descendants"
              }
              pointerEvents={selectedTab === "all" ? "auto" : "none"}
              style={[styles.pane, { width: pageWidth }]}
            >
              <AllJobsScreen
                onJobPress={handleJobPress}
                onSaveJob={handleSaveJob}
              />
            </View>
            <View
              accessibilityElementsHidden={selectedTab !== "saved"}
              importantForAccessibility={
                selectedTab === "saved" ? "auto" : "no-hide-descendants"
              }
              pointerEvents={selectedTab === "saved" ? "auto" : "none"}
              style={[styles.pane, { width: pageWidth }]}
            >
              <SavedJobsScreen
                onBrowseJobs={() => setSelectedTab("all")}
                onJobPress={handleJobPress}
                onLogin={() => navigation.navigate("Login")}
              />
            </View>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    flex: 1,
    gap: 20,
    paddingBottom: 0,
    paddingHorizontal: 12,
  },
  title: {
    color: colors.navy,
    fontSize: 25,
    fontWeight: "600",
    letterSpacing: -0.6,
  },
  tabs: {
    backgroundColor: "#E9EEF6",
    borderRadius: 13,
    flexDirection: "row",
    padding: 4,
  },
  tab: {
    alignItems: "center",
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
    minHeight: 42,
  },
  selectedTab: {
    backgroundColor: colors.white,
    elevation: 1,
    shadowColor: "#1E2C43",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  tabLabel: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  selectedTabLabel: {
    color: colors.blueDark,
    fontWeight: "700",
  },
  paneViewport: {
    flex: 1,
    overflow: "hidden",
  },
  paneTrack: {
    flex: 1,
    flexDirection: "row",
  },
  pane: {
    flex: 1,
    flexShrink: 0,
  },
});
