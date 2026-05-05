type MerchFiltersProps = {
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
};

const filters = [
  { id: "all", label: "Все" },
  { id: "hoodies", label: "Худи" },
  { id: "tshirts", label: "Футболки" },
  { id: "accessories", label: "Аксессуары" },
];

export default function MerchFilters({
  activeFilter = "all",
  onFilterChange = () => {},
}: MerchFiltersProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onFilterChange(filter.id)}
            className={`
              rounded-full px-6 py-3 text-[15px] font-semibold transition-all
              ${
                isActive
                  ? "bg-[#FF3E80] text-white shadow-[0_4px_12px_rgba(255,62,128,0.35)]"
                  : "bg-white text-[#1A1A1A] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:bg-[#FFF0F6]"
              }
              [font-family:var(--font-montserrat-alt)]
            `}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
