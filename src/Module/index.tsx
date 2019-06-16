import React from "react";
import { DragScroll } from "../Component";

const Block: React.FC<{ color: string }> = ({ color }) => {
    return (
        <div
            style={{ backgroundColor: color, width: "100%", height: "100%" }}
        />
    );
};

const App: React.FC = () => {
    return (
        <DragScroll>
            <Block color="#f0f" />
            <Block color="#0ff" />
            <Block color="#0f0" />
        </DragScroll>
    );
};

export default App;
