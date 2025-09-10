import { FC, useEffect } from "react";

import EvaluationsList from "./evaluationsList";
import { fetchEvaluations } from "@/store/slices/evaluations.slice";
import { useAppDispatch } from "@/store/store";

interface Props {
  playerId: string;
}
const PlayerEvaluationsList: FC<Props> = ({ playerId }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchEvaluations({ playerId }));
  }, []);

  return (
    <div>
      <EvaluationsList />
    </div>
  );
};

export default PlayerEvaluationsList;
