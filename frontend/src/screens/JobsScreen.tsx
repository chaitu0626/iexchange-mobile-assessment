import { useEffect, useState } from "react";
import {
  Animated,
  ScrollView,
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
import { JobCard, type JobCardData } from "../components/JobCard";
import { colors } from "../components/theme";
import { SavedJobsScreen } from "./SavedJobsScreen";
import type { MainTabParamList, RootStackParamList } from "../types/navigation";

type JobsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Jobs">,
  NativeStackScreenProps<RootStackParamList>
>;

type JobsTab = "all" | "saved";

const sampleJobs: JobCardData[] = [
  {
    id: "sample-product-engineer",
    title: "Product Engineer",
    company: "Northstar Labs",
    location: "Remote",
    type: "Full time",
    initials: "N",
  },
  {
    id: "sample-mobile-developer",
    title: "Mobile Developer",
    company: "Bluebird Studio",
    location: "New York, NY",
    type: "Full time",
    initials: "B",
  },
  {
    id: "sample-frontend-engineer",
    title: "Frontend Engineer",
    company: "Cedar Technologies",
    location: "Austin, TX",
    type: "Hybrid",
    initials: "C",
  },
];

export function JobsScreen({ navigation }: JobsScreenProps) {
  const [selectedTab, setSelectedTab] = useState<JobsTab>("all");
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const pageWidth = windowWidth - 40;
  const [translateX] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.timing(translateX, {
      toValue: selectedTab === "saved" ? -pageWidth : 0,
      duration: 280,
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
  }, [pageWidth, selectedTab, translateX]);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headingRow}>
          <Text style={styles.title}>Opportunities</Text>
          <View accessibilityLabel="Information" style={styles.avatar}>
            <Text style={styles.avatarText}>i</Text>
          </View>
        </View>

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
              <View style={styles.listSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Latest opportunities</Text>
                  <Text style={styles.resultCount}>{sampleJobs.length} jobs</Text>
                </View>
                {sampleJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onPress={() =>
                      navigation.navigate("JobDetails", {
                        jobId: job.id,
                        title: job.title,
                      })
                    }
                  />
                ))}
                <Text style={styles.placeholderNote}>
                  Sample listings for the navigation setup.
                </Text>
              </View>
            </View>
            <View
              accessibilityElementsHidden={selectedTab !== "saved"}
              importantForAccessibility={
                selectedTab === "saved" ? "auto" : "no-hide-descendants"
              }
              pointerEvents={selectedTab === "saved" ? "auto" : "none"}
              style={[styles.pane, { width: pageWidth }]}
            >
              <SavedJobsScreen onBrowseJobs={() => setSelectedTab("all")} />
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    gap: 24,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  headingRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    color: colors.navy,
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.blue,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  avatarText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "800",
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
  listSection: {
    gap: 13,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  sectionTitle: {
    color: colors.navy,
    fontSize: 17,
    fontWeight: "700",
  },
  resultCount: {
    color: colors.muted,
    fontSize: 12,
  },
  placeholderNote: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 1,
    textAlign: "center",
  },
  paneViewport: {
    overflow: "hidden",
  },
  paneTrack: {
    flexDirection: "row",
  },
  pane: {
    flexShrink: 0,
  },
});
