import { lazy } from "react";

const manifest = {
  plugin: "care_sbiepay",
  routes: {},
  extends: [],
  components: {
    FacilityHomeActions: lazy(
      () => import("./components/pluggables/FacilityHomeActions")
    ),
  },
  navItems: [],
  encounterTabs: {},
};

export default manifest;
