import React from "react";

interface IDragScrollProps {
    transformTime?: number;
}

const DragScroll: React.FC<React.PropsWithChildren<IDragScrollProps>> = ({
    children,
    transformTime = 500
}) => {
    // ref scroll div
    const divRef = React.createRef<HTMLDivElement>();
    // set index
    const [currentIndex, setPageIndex] = React.useState(0);
    // children count
    const indexCount = React.Children.count(children);
    // some state
    const state = {
        touchPoint: {
            start: {
                x: 0,
                y: 0
            },
            end: {
                x: 0,
                y: 0
            }
        },
        scrolling: false,
        touching: false
    };
    // normal scroll transition
    const scrollTransition = `transform 0ms ease`;
    // jump other page transition
    const jumpTransition = `transform ${transformTime}ms ease`;
    const scroll = (
        pageNumber: number,
        offsetScroll: number,
        transition: string
    ) => {
        const { current: div } = divRef;
        if (!div) return;
        div.style.transition = transition;
        div.style.transform = `translate3d(0, ${pageNumber *
            -1 *
            div.clientHeight +
            offsetScroll}px, 0)`;
    };
    const scrollIndexPage = (scrollIndex: number, offsetScroll: number = 0) => {
        const { current: div } = divRef;
        if (!div || state.scrolling) return;
        state.scrolling = true;
        scroll(scrollIndex, offsetScroll, jumpTransition);
    };
    // reInit status
    const resetScrollStatus = (scrollIndex: number) => {
        return setTimeout(() => {
            const { current: div } = divRef;
            if (!div || !state.scrolling) return;
            state.scrolling = false;
            setPageIndex(scrollIndex);
            if (div) div.style.transition = scrollTransition;
        }, transformTime + 200);
    };
    const nextPage = () => {
        const scrollIndex =
            currentIndex + 1 > indexCount - 1
                ? indexCount - 1
                : currentIndex + 1;
        scrollIndexPage(scrollIndex);
        resetScrollStatus(scrollIndex);
    };
    const previousPage = () => {
        const scrollIndex = currentIndex - 1 < 0 ? 0 : currentIndex - 1;
        scrollIndexPage(scrollIndex);
        resetScrollStatus(scrollIndex);
    };
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }}
        >
            <div
                ref={divRef}
                style={{
                    width: "100%",
                    height: "100%",
                    transition: `transform 0s ease`
                }}
                onWheel={e => {
                    if (state.scrolling) return;
                    if (state.touching) return;
                    if (e.deltaY > 0) {
                        // scroll next page
                        nextPage();
                    } else {
                        // scroll last page
                        previousPage();
                    }
                }}
                onTouchMove={e => {
                    // scroll
                    if (state.scrolling) return;
                    // not start touch not move
                    if (!state.touching) return;
                    // not scroll
                    const { touchPoint } = state;
                    touchPoint.end.x = e.targetTouches[0].clientX;
                    touchPoint.end.y = e.targetTouches[0].clientY;
                    const distanceY = touchPoint.end.y - touchPoint.start.y;
                    scroll(currentIndex, distanceY, scrollTransition);
                    return true;
                }}
                onTouchStart={e => {
                    // scroll
                    if (state.scrolling) return;
                    // not touch double
                    if (state.touching) return;
                    // set touching
                    state.touching = true;
                    // not scroll
                    const { touchPoint } = state;
                    touchPoint.start.x = e.targetTouches[0].clientX;
                    touchPoint.start.y = e.targetTouches[0].clientY;
                    touchPoint.end.x = e.targetTouches[0].clientX;
                    touchPoint.end.y = e.targetTouches[0].clientY;
                }}
                onTouchEnd={e => {
                    // scroll
                    if (state.scrolling) return;
                    // not start touch not end
                    if (!state.touching) return;
                    // set start touch false
                    state.touching = false;
                    // not scroll
                    const { start, end } = state.touchPoint;
                    // let distanceX = end.x - start.x,
                    const distanceY = end.y - start.y;
                    if (!divRef.current) return false;
                    if (Math.abs(distanceY) < 100)
                        // not sufficient move distance
                        return scroll(currentIndex, 0, jumpTransition);
                    // scroll(currentIndex, 0, jumpTransition);
                    else {
                        // distanceY > 0
                        if (distanceY < 0) {
                            // scroll next page
                            nextPage();
                        } else {
                            // scroll last page
                            previousPage();
                        }
                    }
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default DragScroll;
