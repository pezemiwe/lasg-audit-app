import React from "react";
import { Search } from "lucide-react";
import s from "../../../styles/regulations.module.css";

interface Props {
  search: string;
  setSearch: (v: string) => void;
  typeFilter: string;
  setTypeFilter: (v: string) => void;
  jurisdictionFilter: string;
  setJurisdictionFilter: (v: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (v: "grid" | "list") => void;
  dashboardView: boolean;
}

const RegulationsFilters: React.FC<Props> = ({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  jurisdictionFilter,
  setJurisdictionFilter,
  viewMode,
  setViewMode,
  dashboardView,
}) => {
  return (
    <div className={s.filters_bar} data-dashboard={dashboardView}>
      <div className={s.filters_inner}>
        <div className={s.filters_row}>
          <div className={s.search_wrap}>
            <span className={s.search_icon} aria-hidden="true">
              <Search />
            </span>
            <input
              type="search"
              className={s.search_input}
              placeholder="Search regulations by title, jurisdiction, or keyword..."
              aria-label="Search regulations"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className={s.filter_select}
            aria-label="Filter by audit type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Audit Types</option>
            <option value="fa">Financial Audit</option>
            <option value="pa">Performance Audit</option>
            <option value="ca">Compliance Audit</option>
          </select>

          <select
            className={s.filter_select}
            aria-label="Filter by jurisdiction"
            value={jurisdictionFilter}
            onChange={(e) => setJurisdictionFilter(e.target.value)}
          >
            <option value="all">All Jurisdictions</option>
            <option value="federal">Federal</option>
            <option value="lagos">Lagos State</option>
          </select>

          <div className={s.view_toggle} role="group" aria-label="View mode">
            <button
              className={`${s.view_btn} ${
                viewMode === "grid" ? s.view_btn_active : ""
              }`}
              onClick={() => setViewMode("grid")}
            >
              Grid
            </button>
            <button
              className={`${s.view_btn} ${
                viewMode === "list" ? s.view_btn_active : ""
              }`}
              onClick={() => setViewMode("list")}
            >
              List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulationsFilters;
