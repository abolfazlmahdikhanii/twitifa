"use client"
import { useClickOutside } from "@/hooks/useClickOutside";
import { Input } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SearchModal from "../SearchModal/SearchModal";
import Icon from "../Icon/Icon";

const SearchBox = ({ isSearchPage = false, query }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setDebouncedQuery(value);
      }, 500),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  const searchHandler = useCallback(
    (value) => {
      setSearchQuery(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );
  useEffect(() => {
    if (!query) return;
    const id = setTimeout(() => searchHandler(query), 0);
    return () => clearTimeout(id);
  }, [searchHandler, query]);
  const searchRef = useRef(null);

  useClickOutside(searchRef, () => {
    if (isOpen) setIsOpen(false);
  });
  const { data: searchResult = [], isFetching } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async () => {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(debouncedQuery)}`,
      );
      if (!res.ok) throw new Error("Error");
      const data = await res.json();
      return data.result || [];
    },
    enabled: debouncedQuery.trim().length > 2,
  });

  return (
    <div className="relative flex-1 w-full" ref={searchRef}>
      <div className="relative">
        <Icon name="search" className="input-icon--search w-5.5 h-5.5" />

        <Input
          placeholder="جستجو در تویتیفای"
          type="text"
          className={isSearchPage ? "input-sm--search" : "input-lg--search"}
          value={searchQuery}
          onChange={(e) => {
            searchHandler(e.target.value);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 w-full overflow-hidden bg-[#17172C] border border-[#34344E] rounded-3xl shadow-none transition-all duration-100">
          <SearchModal
            results={searchResult}
            isSearching={isFetching}
            query={searchQuery}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBox;
