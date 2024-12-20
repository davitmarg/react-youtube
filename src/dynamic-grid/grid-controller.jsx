import styled from "styled-components";

const GridItemDiv = styled.div`
  width  : ${({size, cols}) => cols * size}px;  
  height  : ${({size, rows}) => rows * size}px;
  background-color: ${({bgcolor}) => bgcolor || 'transparent'};
  position: absolute;
  top: ${({ startRow, size }) => (startRow - 1) * size || 0}px;
  left: ${({ startCol, size }) => (startCol - 1) * size || 0}px;
`;

export function GridItem({rows, cols, size, startRow, startCol, children, bgcolor}){

    return <GridItemDiv rows={rows} cols={cols} size={size} startRow={startRow} startCol={startCol} bgcolor={bgcolor}>
        {children}
        </GridItemDiv>
}   

export function isIntersecting(item1, item2) {
    return !(
      item1.startRow + item1.rowSpan - 1 < item2.startRow ||
      item1.startRow > item2.startRow + item2.rowSpan - 1 ||
      item1.startCol + item1.colSpan - 1 < item2.startCol ||
      item1.startCol > item2.startCol + item2.colSpan - 1
    );
  }
  
export function findFreePosition(rows, cols, rowSpan, colSpan, existingItems) {

    for (let row = 1; row <= rows - rowSpan + 1; row++) {
        for (let col = 1; col <= cols - colSpan + 1; col++) {
            
        let isFree = true;
        for (let item of existingItems) {
            if (isIntersecting(item, { startRow: row, startCol: col, rowSpan, colSpan })) {
            isFree = false;
            break;
            }
        }
        if (isFree) return { startRow: row, startCol: col };
        }
    }
    return null;
}