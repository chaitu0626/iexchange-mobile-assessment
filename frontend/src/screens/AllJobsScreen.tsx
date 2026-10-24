import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ActionButton } from "../components/ActionButton";
import { JobCard, type JobCardData } from "../components/JobCard";
import { colors } from "../components/theme";
import { getJobs } from "../services/jobsService";
import type { Job } from "../types/job";

type AllJobsScreenProps = {
  onJobPress: (jobId: string) => void;
  onSaveJob: () => void;
};

function getCompanyInitials(company: string): string {
  const words = company.trim().split(/\s+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Could not load jobs.";
}

type EmptyStateProps = {
  error: string | null;
  isLoading: boolean;
  searchQuery: string;
  onRetry: () => void;
};

function EmptyState({
  error,
  isLoading,
  searchQuery,
  onRetry,
}: EmptyStateProps) {
  if (isLoading) {
    return (
      <View style={styles.emptyState}>
        <ActivityIndicator color={colors.blue} size="large" />
        <Text style={styles.emptyMessage}>Loading jobs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Unable to load jobs</Text>
        <Text style={styles.emptyMessage}>{error}</Text>
        <ActionButton onPress={onRetry} title="Retry" variant="secondary" />
      </View>
    );
  }

  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>
        {searchQuery ? "No jobs found" : "No jobs available"}
      </Text>
      {searchQuery ? (
        <Text style={styles.emptyMessage}>
          Try another title, company, location, or skill.
        </Text>
      ) : null}
    </View>
  );
}

export function AllJobsScreen({
  onJobPress,
  onSaveJob,
}: AllJobsScreenProps) {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestSequence = useRef(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const requestJobs = useCallback(
    async () => {
      const requestId = ++requestSequence.current;

      try {
        const results = await getJobs(searchQuery);
        if (requestId === requestSequence.current) {
          setJobs(results);
        }
      } catch (requestError) {
        if (requestId === requestSequence.current) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (requestId === requestSequence.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    const requestId = ++requestSequence.current;
    getJobs(searchQuery)
      .then((results) => {
        if (requestId === requestSequence.current) {
          setJobs(results);
        }
      })
      .catch((requestError: unknown) => {
        if (requestId === requestSequence.current) {
          setError(getErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (requestId === requestSequence.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      });

    return () => {
      requestSequence.current += 1;
    };
  }, [searchQuery]);

  const handleSearchChange = useCallback(
    (value: string) => {
      if (value.trim() !== searchQuery) {
        requestSequence.current += 1;
        setIsLoading(true);
        setIsRefreshing(false);
        setError(null);
      }
      setSearchInput(value);
    },
    [searchQuery]
  );

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setError(null);
    void requestJobs();
  }, [requestJobs]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setError(null);
    void requestJobs();
  }, [requestJobs]);

  const cardJobs = useMemo<JobCardData[]>(
    () =>
      jobs.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        initials: getCompanyInitials(job.company),
        skills: job.skills,
      })),
    [jobs]
  );

  const renderJob = useCallback(
    ({ item }: { item: JobCardData }) => {
      return (
        <JobCard
          job={item}
          onPress={() => onJobPress(item.id)}
          onSave={onSaveJob}
        />
      );
    },
    [onJobPress, onSaveJob]
  );

  const listHeader = (
    <View style={styles.listHeader}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          accessibilityLabel="Search jobs"
          autoCapitalize="none"
          onChangeText={handleSearchChange}
          placeholder="Search jobs, companies, locations..."
          placeholderTextColor={colors.muted}
          returnKeyType="search"
          style={styles.searchInput}
          value={searchInput}
        />
        {searchInput.length > 0 ? (
          <Pressable
            accessibilityLabel="Clear job search"
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => handleSearchChange("")}
            style={styles.clearButton}
          >
            <Text style={styles.clearText}>×</Text>
          </Pressable>
        ) : null}
        {isLoading && jobs.length > 0 ? (
          <ActivityIndicator color={colors.blue} size="small" />
        ) : null}
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Latest opportunities</Text>
        <Text style={styles.resultCount}>
          {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
        </Text>
      </View>
      {error && jobs.length > 0 ? (
        <View style={styles.inlineError}>
          <Text style={styles.inlineErrorText}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={handleRetry}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  return (
    <FlatList
      contentContainerStyle={styles.listContent}
      data={cardJobs}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      keyExtractor={(job) => job.id}
      ListEmptyComponent={
        <EmptyState
          error={error}
          isLoading={isLoading}
          onRetry={handleRetry}
          searchQuery={searchQuery}
        />
      }
      ListHeaderComponent={listHeader}
      onRefresh={handleRefresh}
      refreshing={isRefreshing}
      renderItem={renderJob}
      showsVerticalScrollIndicator={false}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    gap: 13,
    paddingBottom: 28,
    paddingHorizontal: 0,
    paddingTop: 6,
  },
  listHeader: {
    gap: 16,
    marginBottom: 2,
  },
  searchContainer: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: "#E2E5EA",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 50,
    paddingHorizontal: 13,
  },
  searchIcon: {
    color: colors.muted,
    fontSize: 24,
    marginRight: 8,
  },
  searchInput: {
    color: colors.navy,
    flex: 1,
    fontSize: 14,
    minHeight: 48,
    paddingVertical: 8,
  },
  clearButton: {
    alignItems: "center",
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  clearText: {
    color: colors.muted,
    fontSize: 24,
    lineHeight: 27,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
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
  inlineError: {
    alignItems: "center",
    backgroundColor: "#FFF2F0",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  inlineErrorText: {
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
  emptyState: {
    alignItems: "center",
    flex: 1,
    gap: 12,
    justifyContent: "center",
    minHeight: 180,
    paddingHorizontal: 12,
  },
  emptyTitle: {
    color: colors.navy,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyMessage: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
});
