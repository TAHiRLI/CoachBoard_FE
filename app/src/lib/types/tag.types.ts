export type Tag = {
  id: string;
  name: string;
};

export type TagState = {
  tags: Tag[];
  loading: boolean;
  error: string | null;
  selectedTag: Tag | null;
};
