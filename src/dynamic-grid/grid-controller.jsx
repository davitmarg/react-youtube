import styled from "styled-components";

const GridItemDiv = styled.div`
  width  : ${({size, cols}) => cols * size}px;  
  height  : ${({size, rows}) => rows * size}px;
  background-color: ${({bgcolor}) => bgcolor || 'transparent'};
  position: absolute;
  top: ${({ row_start, size }) => (row_start - 1) * size || 0}px;
  left: ${({ col_start, size }) => (col_start - 1) * size || 0}px;
`;

export function GridItem({rows, cols, size, row_start, col_start, children, bgcolor}){

    return <GridItemDiv rows={rows} cols={cols} size={size} row_start={row_start} col_start={col_start} bgcolor={bgcolor}>
        {children}
        </GridItemDiv>
}   

export function isIntersecting(item1, item2) {
    return !(
      item1.row_start + item1.rowSpan - 1 < item2.row_start ||
      item1.row_start > item2.row_start + item2.rowSpan - 1 ||
      item1.col_start + item1.colSpan - 1 < item2.col_start ||
      item1.col_start > item2.col_start + item2.colSpan - 1
    );
  }
  
export function findFreePosition(rows, cols, rowSpan, colSpan, existingItems) {

    for (let row = 1; row <= rows - rowSpan + 1; row++) {
        for (let col = 1; col <= cols - colSpan + 1; col++) {
            
        let isFree = true;
        for (let item of existingItems) {
            if (isIntersecting(item, { row_start: row, col_start: col, rowSpan, colSpan })) {
            isFree = false;
            break;
            }
        }
        if (isFree) return { row_start: row, col_start: col };
        }
    }
    return null;
}