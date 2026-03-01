declare module 'react-window' {
    import * as React from 'react';

    export interface ListChildComponentProps {
        index: number;
        style: React.CSSProperties;
        data: any;
    }

    export interface ListOnItemsRenderedProps {
        overscanStartIndex: number;
        overscanStopIndex: number;
        visibleStartIndex: number;
        visibleStopIndex: number;
    }

    export interface FixedSizeListProps {
        children: React.ComponentType<ListChildComponentProps>;
        height: number;
        itemCount: number;
        itemSize: number;
        width: string | number;
        itemData?: any;
        onItemsRendered?: (props: ListOnItemsRenderedProps) => void;
    }

    export class FixedSizeList extends React.Component<FixedSizeListProps> { }
}
