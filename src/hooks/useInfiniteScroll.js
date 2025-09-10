import { useState, useEffect, useCallback, useRef } from 'react';

export const useInfiniteScroll = ({
  fetchMore,
  hasMore,
  isLoading,
  threshold = 0.8, // Start loading when 80% scrolled
  rootMargin = '200px', // Start loading 200px before reaching the element
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const loadMoreRef = useRef(null);
  const observerRef = useRef(null);

  // Callback to trigger loading more data
  const loadMore = useCallback(async () => {
    if (isFetching || isLoading || !hasMore) return;
    
    setIsFetching(true);
    try {
      await fetchMore();
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setIsFetching(false);
    }
  }, [fetchMore, hasMore, isFetching, isLoading]);

  // Set up intersection observer
  useEffect(() => {
    const currentLoadMoreRef = loadMoreRef.current;
    
    if (!currentLoadMoreRef) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading && !isFetching) {
          loadMore();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(currentLoadMoreRef);

    return () => {
      if (observerRef.current && currentLoadMoreRef) {
        observerRef.current.unobserve(currentLoadMoreRef);
      }
    };
  }, [hasMore, isLoading, isFetching, loadMore, threshold, rootMargin]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    loadMoreRef,
    isFetching: isFetching || isLoading,
    loadMore,
  };
};

export default useInfiniteScroll;
