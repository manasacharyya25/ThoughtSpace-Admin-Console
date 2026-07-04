/** ISO UTC → value for `<input type="datetime-local">` in local timezone */
export function publishAtToInputValue(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Local datetime-local input → ISO UTC string, or null if empty */
export function inputValueToPublishAt(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}
