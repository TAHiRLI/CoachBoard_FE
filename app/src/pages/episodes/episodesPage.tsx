import { Add } from "@mui/icons-material";
import AddEpisode from "@/components/episodes/AddEpisode";
import { Button } from "@mui/material";
import CustomModal from "@/components/customModal/customModal";
import EpisodesList from "@/components/episodes/EpisodesList";
import { fetchEpisodes } from "@/store/slices/episodes.slice";
import { useAppDispatch } from "@/store/store";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PageActions from "@/components/layout/pageActions";

const EpisodesPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <PageActions>
        <Button variant="contained" startIcon={<Add />} onClick={() => setIsOpen(true)}>
          {t("static.addEpisode")}
        </Button>
      </PageActions>
      <EpisodesList />
      <CustomModal open={isOpen} setOpen={setIsOpen}>
        <AddEpisode
          onCancel={() => {
            setIsOpen(false);
          }}
          onSuccess={() => {
            dispatch(fetchEpisodes());
            setIsOpen(false);
          }}
        />
      </CustomModal>
    </div>
  );
};

export default EpisodesPage;
