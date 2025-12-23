const CONTINENT_LABELS_KO = {
  All: "전체",
  Asia: "아시아",
  Europe: "유럽",
  "North America": "북아메리카",
  "South America": "남아메리카",
  Oceania: "오세아니아",
  Africa: "아프리카",
};

const TAG_LABELS_KO = {
  Popular: "인기",
  Rising: "떠오르는",
};

export function continentLabelKo(continent) {
  if (!continent) return "";
  return CONTINENT_LABELS_KO[continent] ?? String(continent);
}

export function tagLabelKo(tag) {
  if (!tag) return "";
  return TAG_LABELS_KO[tag] ?? String(tag);
}

