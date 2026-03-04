import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

const COMMON_TIMEZONES = [
  { label: "UTC", value: "UTC", offset: 0 },
  { label: "CET (Central Europe)", value: "Europe/Berlin", offset: 1 },
  { label: "EET (Eastern Europe)", value: "Europe/Bucharest", offset: 2 },
  { label: "MSK (Moscow)", value: "Europe/Moscow", offset: 3 },
  { label: "GST (Dubai)", value: "Asia/Dubai", offset: 4 },
  { label: "IST (India)", value: "Asia/Kolkata", offset: 5.5 },
  { label: "CST (China)", value: "Asia/Shanghai", offset: 8 },
  { label: "JST (Japan)", value: "Asia/Tokyo", offset: 9 },
  { label: "KST (Korea)", value: "Asia/Seoul", offset: 9 },
  { label: "AEST (Sydney)", value: "Australia/Sydney", offset: 11 },
  { label: "NZST (New Zealand)", value: "Pacific/Auckland", offset: 13 },
  { label: "EST (New York)", value: "America/New_York", offset: -5 },
  { label: "CST (Chicago)", value: "America/Chicago", offset: -6 },
  { label: "MST (Denver)", value: "America/Denver", offset: -7 },
  { label: "PST (Los Angeles)", value: "America/Los_Angeles", offset: -8 },
  { label: "BRT (São Paulo)", value: "America/Sao_Paulo", offset: -3 },
  { label: "AST (Buenos Aires)", value: "America/Argentina/Buenos_Aires", offset: -3 },
  { label: "GMT (London)", value: "Europe/London", offset: 0 },
  { label: "IST (Israel)", value: "Asia/Jerusalem", offset: 2 },
  { label: "TRT (Turkey)", value: "Europe/Istanbul", offset: 3 },
];

interface TimezoneContextState {
  timezone: string;
  timezoneLabel: string;
  setTimezone: (tz: string) => void;
  convertTime: (timeStr: string) => string;
  timezones: typeof COMMON_TIMEZONES;
}

const TimezoneContext = createContext<TimezoneContextState>({
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  timezoneLabel: "",
  setTimezone: () => {},
  convertTime: (t) => t,
  timezones: COMMON_TIMEZONES,
});

export const useTimezone = () => useContext(TimezoneContext);

function detectUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

export const TimezoneProvider = ({ children }: { children: ReactNode }) => {
  const [timezone, setTimezoneState] = useState(() => {
    const saved = localStorage.getItem("cs2edge-timezone");
    return saved || detectUserTimezone();
  });

  const setTimezone = useCallback((tz: string) => {
    setTimezoneState(tz);
    localStorage.setItem("cs2edge-timezone", tz);
  }, []);

  const timezoneLabel = COMMON_TIMEZONES.find(t => t.value === timezone)?.label 
    || timezone.split("/").pop()?.replace(/_/g, " ") 
    || timezone;

  const convertTime = useCallback((timeStr: string): string => {
    if (!timeStr || timeStr === "TBD" || timeStr.toLowerCase() === "live") return timeStr;

    // Parse "HH:MM CET" or "HH:MM" format
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(CET|CEST|UTC|GMT|EST|PST|CST|MST|EET|IST)?/i);
    if (!match) return timeStr;

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const sourceTz = (match[3] || "CET").toUpperCase();

    // Convert source timezone to UTC offset (hours)
    const tzOffsets: Record<string, number> = {
      UTC: 0, GMT: 0, CET: 1, CEST: 2, EET: 2, MSK: 3,
      EST: -5, CST: -6, MST: -7, PST: -8, IST: 5.5,
    };

    const sourceOffset = tzOffsets[sourceTz] ?? 1; // default CET

    // Create a date in UTC
    const now = new Date();
    const utcDate = new Date(Date.UTC(
      now.getFullYear(), now.getMonth(), now.getDate(),
      hours - sourceOffset, minutes
    ));

    // Format in target timezone
    try {
      const formatted = utcDate.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: timezone,
        hour12: false,
      });

      // Get short timezone abbreviation
      const tzAbbr = utcDate.toLocaleTimeString("en-US", {
        timeZoneName: "short",
        timeZone: timezone,
      }).split(" ").pop();

      return `${formatted} ${tzAbbr}`;
    } catch {
      return timeStr;
    }
  }, [timezone]);

  return (
    <TimezoneContext.Provider value={{ timezone, timezoneLabel, setTimezone, convertTime, timezones: COMMON_TIMEZONES }}>
      {children}
    </TimezoneContext.Provider>
  );
};
