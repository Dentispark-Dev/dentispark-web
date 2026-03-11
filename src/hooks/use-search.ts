import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface UseSearchOptions {
    debounceMs?: number;
    paramName?: string;
    onSearch?: (value: string) => void;
}

/**
 * A reusable hook for handling search functionality with debouncing
 * and URL state synchronization.
 */
export function useSearch({
    debounceMs = 500,
    paramName = "q",
    onSearch,
}: UseSearchOptions = {}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get initial value from URL
    const initialValue = searchParams.get(paramName) || "";
    const [value, setValue] = useState(initialValue);
    const [debouncedValue, setDebouncedValue] = useState(initialValue);
    const lastValueRef = useRef(initialValue);

    // Update debounced value
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [value, debounceMs]);

    // Synchronize with URL and trigger callback
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        const currentUrlValue = searchParams.get(paramName) || "";

        if (debouncedValue) {
            params.set(paramName, debouncedValue);
        } else {
            params.delete(paramName);
        }

        const newQueryString = params.toString();
        const nextUrl = `${pathname}${newQueryString ? `?${newQueryString}` : ""}`;

        // Only push if the URL value actually changed to avoid unnecessary history entries
        if (debouncedValue !== currentUrlValue) {
            router.push(nextUrl, { scroll: false });
        }

        // Only trigger onSearch if the value changed to prevent infinite loops
        if (onSearch && debouncedValue !== lastValueRef.current) {
            lastValueRef.current = debouncedValue;
            onSearch(debouncedValue);
        }
    }, [debouncedValue, paramName, pathname, router, searchParams, onSearch]);

    const handleChange = useCallback((newValue: string) => {
        setValue(newValue);
    }, []);

    const clear = useCallback(() => {
        setValue("");
    }, []);

    return {
        value,
        debouncedValue,
        setValue: handleChange,
        clear,
        isSearching: value !== debouncedValue,
    };
}
