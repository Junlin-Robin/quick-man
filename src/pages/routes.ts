import { lazy } from "react";

export default [
  {
    path: "/calculation/qm/isotope-fractionation/frequency",
    componentL: lazy(
      () =>
        import(
          /* webpackChunkName: "frequency-isotope_fractionation" */ "./subpages/isotope-fractionation/frequency-calculation/views/overview"
        )
    ),
  },
  {
    path: "/calculation/qm/isotope-fractionation/frequency/detail",
    componentL: lazy(
      () =>
        import(
          /* webpackChunkName: "frequency-isotope_fractionation_detail" */ "./subpages/isotope-fractionation/frequency-calculation/views/details"
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
