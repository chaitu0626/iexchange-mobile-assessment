import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ActionButton } from "../components/ActionButton";
import { JobCard, type JobCardData } from "../components/JobCard";
import { colors } from "../components/theme";
import { useAuth } from "../context/AuthContext";
import { useSavedJobs } from "../context/SavedJobsContext";
import type { Job } from "../types/job";

type SavedJobsScreenProps = {
  onBrowseJobs: () => void;
  onJobPress: (jobId: string) => void;
  onLogin: () => void;
};

function getCompanyInitials(company: string): string {
  return company
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function EmptyState({ onBrowseJobs }: { onBrowseJobs: () => void }) {
  return (
    <View style={styles.state}>
      <Ionicons color={colors.blue} name="bookmark-outline" size={40} />
      <Text style={styles.stateTitle}>No saved jobs yet</Text>
      <Text style={styles.description}>
        Jobs you bookmark will be collected here so you can find them easily.
      </Text>
      <ActionButton onPress={onBrowseJobs} title="Browse all jobs" />
    </View>
  );
}

export function SavedJobsScreen({
  onBrowseJobs,
  onJobPress,
  onLogin,
}: SavedJobsScreenProps) {
  const { user } = useAuth();
  const {
    error,
    isLoading,
    pendingJobIds,
    refreshSavedJobs,
    savedJobs,
    savedJobIds,
    toggleSavedJob,
  } = useSavedJobs();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const cardJobs = useMemo<JobCardData[]>(
    () =>
      savedJobs.map((job: Job) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        initials: getCompanyInitials(job.company),
        skills: job.skills,
      })),
    [savedJobs]
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshSavedJobs();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRemove = async (jobId: string) => {
    try {
      await toggleSavedJob(jobId);
    } catch (requestError) {
      Alert.alert(
        "Could not remove saved job",
        requestError instanceof Error ? requestError.message : "Please try again."
      );
    }
  };

  if (!user) {
    return (
      <View style={styles.state}>
        <Ionicons color={colors.blue} name="bookmark-outline" size={40} />
        <Text style={styles.stateTitle}>Sign in to see saved jobs</Text>
        <Text style={styles.description}>
          Log in to view and manage the jobs you have bookmarked.
        </Text>
        <ActionButton onPress={onLogin} title="Login"  />
        <ActionButton
          onPress={onBrowseJobs}
          title="Browse all jobs"
          variant="secondary"
        />
      </View>
    );
  }

  if (isLoading && savedJobs.length === 0) {
    return (
      <View style={styles.state}>
        <ActivityIndicator color={colors.blue} size="large" />
        <Text style={styles.description}>Loading saved jobs...</Text>
      </View>
    );
  }

  if (error && savedJobs.length === 0) {
    return (
      <View style={styles.state}>
        <Text style={styles.stateTitle}>Unable to load saved jobs</Text>
        <Text style={styles.description}>{error}</Text>
        <ActionButton
          loading={isRefreshing}
          onPress={handleRefresh}
          title="Retry"
          variant="secondary"
        />
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={[
        styles.listContent,
        savedJobs.length === 0 && styles.emptyListContent,
      ]}
      data={cardJobs}
      keyExtractor={(job) => job.id}
      ListEmptyComponent={<EmptyState onBrowseJobs={onBrowseJobs} />}
      ListHeaderComponent={
        error && savedJobs.length > 0 ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable accessibilityRole="button" onPress={handleRefresh}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : undefined
      }
      onRefresh={handleRefresh}
      refreshing={isRefreshing}
      renderItem={({ item }) => (
        <JobCard
          job={item}
          isSaved={savedJobIds.has(item.id)}
          isSaving={pendingJobIds.has(item.id)}
          onPress={() => onJobPress(item.id)}
          onSave={() => void handleRemove(item.id)}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    gap: 13,
    paddingBottom: 28,
    paddingTop: 6,
  },
  emptyListContent: {
    justifyContent: "center",
  },
  state: {
    alignItems: "center",
    flex: 1,
    gap: 14,
    justifyContent: "center",
    minHeight: 180,
    paddingHorizontal: 22,
    paddingTop: 24,
  },
  stateTitle: {
    color: colors.navy,
    fontSize: 19,
    fontWeight: "700",
    marginTop: 6,
    textAlign: "center",
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  errorBanner: {
    alignItems: "center",
    backgroundColor: "#FFF2F0",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  errorText: {
    color: colors.navy,
    flex: 1,
    fontSize: 12,
    marginRight: 10,
  },
  retryText: {
    color: colors.blue,
    fontSize: 13,
    fontWeight: "700",
  },
});
