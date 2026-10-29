import React, { useMemo, useState } from "react";
import { Search, Filter, X, ArrowUpDown, SlidersHorizontal, PackageSearch } from "lucide-react";
import { ItemCard } from "./Home";
import { categories } from "../data/mockData";

export function Browse({
  items,
  search,
  setSearch,
  filterType,
  setFilterType,
  filterCategory,
  setFilterCategory,
  openItem,
  go
}) {
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Multi-field search and flexible filtering
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Must be approved to show on public board
        if (!item.approved) return false;

        // Type filter (Lost / Found)
        if (filterType !== "All" && item.type !== filterType) return false;

        // Category filter
        if (filterCategory !== "All categories" && item.category !== filterCategory) return false;

        // Status filter
        if (filterStatus === "Available" && item.status !== "Available") return false;
        if (filterStatus === "Reunited" && item.status !== "Reunited") return false;

        // Full text search: title, description, location, category
        if (search.trim()) {
          const q = search.toLowerCase();
          const matches =
            item.title.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.location.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q);
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "oldest") return a.id - b.id;
        return b.id - a.id; // newest first by default
      });
  }, [items, filterType, filterCategory, filterStatus, search, sortBy]);

  const hasActiveFilters =
    search.trim() !== "" ||
    filterType !== "All" ||
    filterCategory !== "All categories" ||
    filterStatus !== "All";

  const clearAllFilters = () => {
    setSearch("");
    setFilterType("All");
    setFilterCategory("All categories");
    setFilterStatus("All");
    setSortBy("newest");
  };

  return (
    <section className="page-wrap">
      <div className="page-intro">
        <div className="eyebrow">COMMUNITY BOARD</div>
        <h1>
          Find your <span>missing piece.</span>
        </h1>
        <p>
          Browse public lost and found reports from across campus buildings, labs, and sports grounds.
        </p>
      </div>

      {/* Controls Container */}
      <div className="browse-controls">
        {/* Search bar */}
        <div className="searchbox-wrapper">
          <label className="searchbox" htmlFor="item-search">
            <Search size={18} />
            <input
              id="item-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords, campus location, color, brand..."
            />
            {search && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </label>
        </div>

        {/* Filters and Sorting bar */}
        <div className="filters-bar">
          {/* Type toggles */}
          <div className="filter-chip-group" role="group" aria-label="Item Type Filter">
            <span className="filter-label">
              <Filter size={14} /> Type:
            </span>
            {["All", "Lost", "Found"].map((t) => (
              <button
                key={t}
                type="button"
                className={`filter-chip ${filterType === t ? "selected" : ""}`}
                onClick={() => setFilterType(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="filter-select-wrapper">
            <label htmlFor="category-select" className="sr-only">
              Filter by Category
            </label>
            <select
              id="category-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="filter-select-wrapper">
            <label htmlFor="status-select" className="sr-only">
              Filter by Status
            </label>
            <select
              id="status-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="All">All statuses</option>
              <option value="Available">Available / Active</option>
              <option value="Reunited">Reunited 🎉</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="filter-select-wrapper sort-wrapper">
            <ArrowUpDown size={14} className="sort-icon" />
            <label htmlFor="sort-select" className="sr-only">
              Sort Order
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          {/* Clear Filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              className="clear-all-link"
              onClick={clearAllFilters}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count Line */}
      <div className="results-line">
        <span>
          Showing <strong>{filteredItems.length}</strong>{" "}
          {filteredItems.length === 1 ? "item" : "items"}
          {hasActiveFilters ? " matching filters" : " total"}
        </span>
        <span className="results-sort-label">
          Sorted by: {sortBy === "newest" ? "Most recent" : "Oldest first"}
        </span>
      </div>

      {/* Items Grid or Empty State */}
      {filteredItems.length > 0 ? (
        <div className="item-grid">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} openItem={openItem} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <PackageSearch size={44} />
          </div>
          <h3>No matching items found</h3>
          <p>
            We couldn't find anything matching your search criteria. Try using different keywords,
            clearing the filters, or post a new report so someone can help you.
          </p>
          <div className="empty-state-actions">
            {hasActiveFilters && (
              <button
                type="button"
                className="button button-outline"
                onClick={clearAllFilters}
              >
                Reset filters
              </button>
            )}
            <button
              type="button"
              className="button button-dark"
              onClick={() => go("Report")}
            >
              Report this item
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
