
export const formatString = (str: string) => {
  if (!str || typeof str !== "string") return "";
  const formattedStr = str?.split("_").join(" ");
  return formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1);
};

export const formatStringBy = ({ str, from = "_", to = " " }: { str: string, from?: string, to?: string }) => {
  if (!str || typeof str !== "string") return "";
  const formattedStr = str.split(from).join(to);
  return formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1);
};

