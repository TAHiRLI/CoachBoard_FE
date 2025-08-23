import { useTranslation } from "react-i18next";

export const usePlayerPositions = () => {
  const { t } = useTranslation();

  return [
    { label: t("static.goalkeeper"), value: "Goalkeeper" },
    { label: t("static.centerBack"), value: "CenterBack" },
    { label: t("static.leftBack"), value: "LeftBack" },
    { label: t("static.rightBack"), value: "RightBack" },
    { label: t("static.leftWingBack"), value: "LeftWingBack" },
    { label: t("static.rightWingBack"), value: "RightWingBack" },
    { label: t("static.defensiveMidfielder"), value: "DefensiveMidfielder" },
    { label: t("static.centralMidfielder"), value: "CentralMidfielder" },
    { label: t("static.attackingMidfielder"), value: "AttackingMidfielder" },
    { label: t("static.leftMidfielder"), value: "LeftMidfielder" },
    { label: t("static.rightMidfielder"), value: "RightMidfielder" },
    { label: t("static.striker"), value: "Striker" },
    { label: t("static.centerForward"), value: "CenterForward" },
    { label: t("static.leftWinger"), value: "LeftWinger" },
    { label: t("static.rightWinger"), value: "RightWinger" },
  ];
};