import React, { Children, useEffect, useState } from "react";
import styled from "styled-components";
import { findFreePosition, GridItem } from "./grid-controller";

const GridDiv = styled.div`
    margin-left: 20px;
    margin-top: 10px;
    width: ${({ size, cols }) => cols * size}px;
    height: ${({ size, rows }) => rows * size}px;
    background-color: ${({ bgcolor }) => bgcolor || 'transparent'};
    position: relative;
`;

function extractComponent(element, TargetComponent) {
    if (React.isValidElement(element)) {
      if (element.type === TargetComponent) {
        return element;
      }
  
      const renderedElement = element.type(element.props);
  
      return extractComponent(renderedElement, TargetComponent);
    }
  
    return null;
}

export default function Grid({ rows, cols, size, bgcolor, children }) {
  const getChildrenWithProps = () => {
    const currentItems = [];

    const modifiedChildren = Children.map(children, (child, index) => {
      if (React.isValidElement(child)) {
        child = extractComponent(child, GridItem);

        const rowSpan = child.props.rows || 1;
        const colSpan = child.props.cols || 1;

        // console.log(child);

        if(!child)
            return null;

        // If startRow and startCol are provided, use them
        if (child.props.startRow && child.props.startCol) {
          const newGridItem = {
            startRow: child.props.startRow,
            startCol: child.props.startCol,
            rowSpan,
            colSpan,
          };
          currentItems.push(newGridItem);
          return React.cloneElement(child, {
            key: index,
            startRow: child.props.startRow,
            startCol: child.props.startCol,
            rows: rowSpan,
            cols: colSpan,
            size,
          });
        } else {
          // If not provided, find the free position for the child
          const position = findFreePosition(rows, cols, rowSpan, colSpan, currentItems);
          if (position == null) return null;

          const newGridItem = {
            startRow: position.startRow,
            startCol: position.startCol,
            rowSpan,
            colSpan,
          };

          currentItems.push(newGridItem);
          return React.cloneElement(child, {
            key: index,
            startRow: position.startRow,
            startCol: position.startCol,
            rows: rowSpan,
            cols: colSpan,
            size,
          });
        }
      }
      return child;
    });

    return modifiedChildren;
  };

  const [gridItems, setGridItems] = useState([]);

  useEffect(() => {
    setGridItems(getChildrenWithProps());
  }, [children]);

  return <GridDiv id="main-grid" size={size} bgcolor={bgcolor} rows={rows} cols={cols}>{gridItems}</GridDiv>;
}
