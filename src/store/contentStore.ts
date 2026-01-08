import { create } from "zustand";
import type {
  TierContentItem,
  TierWeeks,
  TestContent,
  VideoContent,
} from "@/types/courseContent";

export type AddContentPayload =
  | { type: "video"; data: VideoContent }
  | { type: "test"; data: TestContent };

export interface ContentStoreState {
  weeks: TierWeeks;
  selectedWeek: string | null;
  selectedDay: string | null;
  setWeeks: (weeks: TierWeeks) => void;
  selectWeek: (week: string) => void;
  selectDay: (day: string) => void;
  getWeeks: () => string[];
  getDays: (week?: string) => string[];
  getContent: (week: string, day: string) => TierContentItem[];
  addWeek: () => string;
  addDay: (week: string) => string | null;
  addContent: (
    week: string,
    day: string,
    payload: AddContentPayload
  ) => TierContentItem | null;
  reset: () => void;
}

const initialState: Pick<
  ContentStoreState,
  "weeks" | "selectedWeek" | "selectedDay"
> = {
  weeks: {},
  selectedWeek: null,
  selectedDay: null,
};

const generateSequentialLabel = (existing: string[], prefix: string) => {
  let index = existing.length + 1;
  let candidate = `${prefix} ${index}`;

  while (existing.includes(candidate)) {
    index += 1;
    candidate = `${prefix} ${index}`;
  }

  return candidate;
};

export const useContentStore = create<ContentStoreState>((set, get) => ({
  ...initialState,
  setWeeks: (weeks) =>
    set((state) => {
      const existingWeek = state.selectedWeek;
      const activeWeek =
        existingWeek && weeks[existingWeek]
          ? existingWeek
          : (Object.keys(weeks)[0] ?? null);

      const existingDay = state.selectedDay;
      const activeDay =
        activeWeek && existingDay && weeks[activeWeek]?.[existingDay]
          ? existingDay
          : activeWeek
            ? (Object.keys(weeks[activeWeek] ?? {})[0] ?? null)
            : null;

      return {
        weeks,
        selectedWeek: activeWeek,
        selectedDay: activeDay,
      };
    }),
  selectWeek: (week) => {
    const { weeks } = get();
    if (!weeks[week]) return;
    const firstDay = Object.keys(weeks[week])[0] ?? null;
    set({ selectedWeek: week, selectedDay: firstDay });
  },
  selectDay: (day) => {
    const { weeks, selectedWeek } = get();
    if (!selectedWeek) return;
    if (!weeks[selectedWeek]?.[day]) return;
    set({ selectedDay: day });
  },
  getWeeks: () => Object.keys(get().weeks),
  getDays: (week) => {
    const activeWeek = week ?? get().selectedWeek;
    if (!activeWeek) return [];
    return Object.keys(get().weeks[activeWeek] ?? {});
  },
  getContent: (week, day) => {
    if (!week || !day) return [];
    return get().weeks[week]?.[day] ?? [];
  },
  addWeek: () => {
    const { weeks } = get();
    const newWeekKey = generateSequentialLabel(Object.keys(weeks), "Week");

    set({
      weeks: {
        ...weeks,
        [newWeekKey]: {},
      },
      selectedWeek: newWeekKey,
      selectedDay: null,
    });

    return newWeekKey;
  },
  addDay: (week) => {
    const { weeks } = get();
    const weekEntry = weeks[week];
    if (!weekEntry) return null;

    const newDayKey = generateSequentialLabel(Object.keys(weekEntry), "Day");

    set({
      weeks: {
        ...weeks,
        [week]: {
          ...weekEntry,
          [newDayKey]: [],
        },
      },
      selectedWeek: week,
      selectedDay: newDayKey,
    });

    return newDayKey;
  },
  addContent: (week, day, payload) => {
    const { weeks } = get();
    const weekEntry = weeks[week];
    const dayEntry = weekEntry?.[day];

    if (!weekEntry || !dayEntry) return null;

    const position = dayEntry.length + 1;

    const newItem: TierContentItem =
      payload.type === "video"
        ? {
            id: payload.data.id,
            module_type: "video",
            position,
            video: payload.data,
          }
        : {
            id: payload.data.id,
            module_type: "test",
            position,
            test: payload.data,
          };

    set({
      weeks: {
        ...weeks,
        [week]: {
          ...weekEntry,
          [day]: [...dayEntry, newItem],
        },
      },
    });

    return newItem;
  },
  reset: () => set(initialState),
}));
