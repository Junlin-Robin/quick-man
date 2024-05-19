import { lazy } from "react";

export default [
  {
    path: "/calculation/qm/isotope-fractionation/frequency",
    componentL: lazy(
      () =>
        import(
          /* webpackChunkName: "frequency-isotope_fractionation" */ "./subpages/isotope-fractionation/frequency-calculation"
        )
    ),
  },
  {
    path: "/calculation/qm/isotope-fractionation/force-constant",
    componentL: lazy(
      () =>
        import(
          /* webpackChunkName: "force_matrix-isotope_fractionation" */ "./subpages/isotope-fractionation/force-matrix-calculation"
        )
    ),
  },
];
