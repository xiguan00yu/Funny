import React from "react";
// import { delay } from "./Util";
import { Loading } from "./Component";
// const Module = React.lazy(() => delay(5000).then(() => import("./Module")));
const Module = React.lazy(() => import("./Module"));

export default () => (
    <React.Suspense fallback={<Loading />}>
        <Module />
    </React.Suspense>
);
