import Keycloak, { KeycloakConfig } from "keycloak-js";

const keycloakConfig: KeycloakConfig = {
  url: "https://keycloak.coachboard.az/",
  realm: "coachboard",
  clientId: "coachboard-front",
};

const keycloak = new Keycloak({
  ...keycloakConfig,
});

export default keycloak;