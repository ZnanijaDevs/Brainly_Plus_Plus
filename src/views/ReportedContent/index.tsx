import createReactRoot from "@lib/createReactRoot";

import FiltersSection from "./components/filters/FiltersSection";

const { render } = createReactRoot(document.getElementById("main-content"));

render(<>
  <FiltersSection />
</>);