export const accentStyles = {
  pink: {
    solid: "bg-[#FF3E80]",
    soft: "bg-[#FFF0F6]",
    pale: "bg-[#FFF7FB]",
    border: "border-[#F7B7D4]",
    text: "text-[#E82E78]",
    ring: "ring-[#FF3E80]/25",
    button: "bg-[#FF3E80] hover:bg-[#FF1A65]",
  },
  blue: {
    solid: "bg-[#335EC8]",
    soft: "bg-[#EEF5FF]",
    pale: "bg-[#F7FBFF]",
    border: "border-[#AFC9EE]",
    text: "text-[#335EC8]",
    ring: "ring-[#335EC8]/25",
    button: "bg-[#335EC8] hover:bg-[#244CA8]",
  },
  green: {
    solid: "bg-[#B8CB2F]",
    soft: "bg-[#F7FBE8]",
    pale: "bg-[#FCFFF3]",
    border: "border-[#D6E779]",
    text: "text-[#7A9411]",
    ring: "ring-[#B8CB2F]/25",
    button: "bg-[#9AC225] hover:bg-[#86AA1F]",
  },
  cyan: {
    solid: "bg-[#22A7C7]",
    soft: "bg-[#F2FCFF]",
    pale: "bg-[#F8FEFF]",
    border: "border-[#9ADDEB]",
    text: "text-[#1688A3]",
    ring: "ring-[#22A7C7]/25",
    button: "bg-[#22A7C7] hover:bg-[#1688A3]",
  },
  violet: {
    solid: "bg-[#7B5BC8]",
    soft: "bg-[#F8F5FF]",
    pale: "bg-[#FCFAFF]",
    border: "border-[#C7B8F1]",
    text: "text-[#6A4FAD]",
    ring: "ring-[#7B5BC8]/25",
    button: "bg-[#7B5BC8] hover:bg-[#6748B4]",
  },
} as const;

export type AccentName = keyof typeof accentStyles;
